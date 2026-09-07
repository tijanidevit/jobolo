import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity.js';
import { Activity } from '../../opportunities/entities/activity.entity.js';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';

const RESPONSE_STAGES = new Set(['recruiter_contact', 'screening', 'interview', 'final_round', 'offer', 'accepted']);
const OFFER_STAGES = new Set(['offer', 'accepted']);

type StageTransition = { opportunityId: string; from: string; to: string; occurredAt: Date };

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunitiesRepository: Repository<Opportunity>,
    @InjectRepository(Interview)
    private readonly interviewsRepository: Repository<Interview>,
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  async getOverview(userId: string) {
    const [opportunities, interviews, activities] = await Promise.all([
      this.opportunitiesRepository.find({ where: { userId } }),
      this.interviewsRepository.find({ where: { userId } }),
      this.activitiesRepository.find({ where: { userId }, order: { occurredAt: 'ASC', createdAt: 'ASC' } }),
    ]);
    const statusCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    for (const opportunity of opportunities) {
      statusCounts.set(opportunity.stage, (statusCounts.get(opportunity.stage) ?? 0) + 1);
      const country = opportunity.companyCountry?.trim() || 'Unspecified';
      countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
    }
    const toBreakdown = (counts: Map<string, number>) =>
      [...counts.entries()]
        .map(([label, count]) => ({ label, count }))
        .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));

    const transitions = activities
      .filter((activity) => activity.type === 'status_change')
      .map((activity): StageTransition | null => {
        const match = activity.description?.match(/Stage changed from ([^ ]+) to ([^ ]+)/);
        if (!match) return null;
        return { opportunityId: activity.opportunityId, from: match[1], to: match[2], occurredAt: new Date(activity.occurredAt) };
      })
      .filter((transition): transition is StageTransition => transition !== null);
    const applications = opportunities.filter((opportunity) => opportunity.dateApplied);
    const applicationDates = new Map(applications.map((opportunity) => [opportunity.id, new Date(opportunity.dateApplied!).getTime()]));
    const responseTimes = transitions
      .filter((transition) => RESPONSE_STAGES.has(transition.to) && applicationDates.has(transition.opportunityId))
      .map((transition) => (transition.occurredAt.getTime() - applicationDates.get(transition.opportunityId)!) / 86_400_000)
      .filter((days) => days >= 0);
    const stageTimes = transitions
      .map((transition, index) => {
        const previous = transitions.slice(0, index).reverse().find((item) => item.opportunityId === transition.opportunityId);
        return previous ? (transition.occurredAt.getTime() - previous.occurredAt.getTime()) / 86_400_000 : null;
      })
      .filter((days): days is number => days !== null && days >= 0);
    const average = (values: number[]) => values.length > 0 ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : null;
    const applicationsCount = applications.length;
    const responseCount = applications.filter((opportunity) => transitions.some((transition) => transition.opportunityId === opportunity.id && RESPONSE_STAGES.has(transition.to))).length;
    const interviewedCount = new Set(interviews.map((interview) => interview.opportunityId)).size;
    const offeredCount = opportunities.filter((opportunity) => OFFER_STAGES.has(opportunity.stage)).length;
    const salaryValue = (opportunity: Opportunity) => {
      const min = opportunity.salaryRangeMin == null ? null : Number(opportunity.salaryRangeMin);
      const max = opportunity.salaryRangeMax == null ? null : Number(opportunity.salaryRangeMax);
      if (min !== null && max !== null) return (min + max) / 2;
      return min ?? max;
    };
    const salaryRows = (key: 'companyCountry' | 'jobTitle') => {
      const groups = new Map<string, { total: number; count: number; currencies: Set<string> }>();
      for (const opportunity of opportunities) {
        const salary = salaryValue(opportunity);
        if (salary === null) continue;
        const label = opportunity[key]?.trim() || 'Unspecified';
        const group = groups.get(label) ?? { total: 0, count: 0, currencies: new Set<string>() };
        group.total += salary;
        group.count += 1;
        if (opportunity.currency) group.currencies.add(opportunity.currency);
        groups.set(label, group);
      }
      return [...groups.entries()].map(([label, group]) => ({ label, average: Number((group.total / group.count).toFixed(2)), currency: group.currencies.size === 1 ? [...group.currencies][0] : group.currencies.size > 1 ? 'Mixed' : null, count: group.count })).sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
    };
    const successRows = (key: 'source' | 'jobTitle' | 'companySize') => {
      const groups = new Map<string, { applications: number; responses: number; interviews: number; offers: number }>();
      for (const opportunity of applications) {
        const label = opportunity[key]?.trim() || 'Unspecified';
        const group = groups.get(label) ?? { applications: 0, responses: 0, interviews: 0, offers: 0 };
        group.applications += 1;
        if (transitions.some((transition) => transition.opportunityId === opportunity.id && RESPONSE_STAGES.has(transition.to))) group.responses += 1;
        if (interviews.some((interview) => interview.opportunityId === opportunity.id)) group.interviews += 1;
        if (OFFER_STAGES.has(opportunity.stage)) group.offers += 1;
        groups.set(label, group);
      }
      return [...groups.entries()].map(([label, group]) => ({ label, ...group, responseRate: Number(((group.responses / group.applications) * 100).toFixed(1)), interviewRate: Number(((group.interviews / group.applications) * 100).toFixed(1)), offerRate: Number(((group.offers / group.applications) * 100).toFixed(1)) })).sort((left, right) => right.applications - left.applications || left.label.localeCompare(right.label));
    };
    const salaryValues = opportunities.map(salaryValue).filter((value): value is number => value !== null);
    const currencies = new Set(opportunities.filter((opportunity) => salaryValue(opportunity) !== null).map((opportunity) => opportunity.currency).filter(Boolean));

    return {
      metrics: {
        opportunities: opportunities.length,
        applications: opportunities.filter((opportunity) => opportunity.dateApplied).length,
        interviews: interviews.length,
        offers: opportunities.filter((opportunity) => ['offer', 'accepted'].includes(opportunity.stage)).length,
      },
      statusDistribution: toBreakdown(statusCounts),
      countryDistribution: toBreakdown(countryCounts),
      advanced: {
        responseRate: applicationsCount > 0 ? Number(((responseCount / applicationsCount) * 100).toFixed(1)) : null,
        interviewConversionRate: applicationsCount > 0 ? Number(((interviewedCount / applicationsCount) * 100).toFixed(1)) : null,
        offerConversionRate: applicationsCount > 0 ? Number(((offeredCount / applicationsCount) * 100).toFixed(1)) : null,
        averageTimeToResponseDays: average(responseTimes),
        averageTimeBetweenStagesDays: average(stageTimes),
        averageSalary: salaryValues.length > 0 ? Number((salaryValues.reduce((sum, value) => sum + value, 0) / salaryValues.length).toFixed(2)) : null,
        salaryCurrency: currencies.size === 1 ? [...currencies][0] : currencies.size > 1 ? 'Mixed' : null,
        salaryByCountry: salaryRows('companyCountry'),
        salaryByRole: salaryRows('jobTitle'),
        successBySource: successRows('source'),
        successByRole: successRows('jobTitle'),
        successByCompanySize: successRows('companySize'),
      },
    };
  }
}
