import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity.js';
import { Activity } from '../../opportunities/entities/activity.entity.js';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { SKILL_CATALOG } from '../../skills/constants/skill-catalog.js';
import type { Insight, InsightsResponse } from '../types/insight.types.js';

const RESPONSE_STAGES = new Set([
  'recruiter_contact',
  'screening',
  'interview',
  'final_round',
  'offer',
  'accepted',
]);

type StageTransition = { opportunityId: string; to: string };
type Group = { applications: number; responses: Set<string> };

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunitiesRepository: Repository<Opportunity>,
    @InjectRepository(Interview)
    private readonly interviewsRepository: Repository<Interview>,
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  async getInsights(userId: string): Promise<InsightsResponse> {
    const [opportunities, interviews, activities] = await Promise.all([
      this.opportunitiesRepository.find({ where: { userId } }),
      this.interviewsRepository.find({ where: { userId } }),
      this.activitiesRepository.find({ where: { userId } }),
    ]);
    const transitions = this.getTransitions(activities);
    const responseIds = this.getResponseIds(opportunities, transitions);
    const insights = [
      this.applicationVolumeInsight(opportunities),
      this.roleConversionInsight(opportunities, responseIds, interviews),
      this.countryResponseInsight(opportunities, responseIds),
      this.interviewSkillsInsight(opportunities, interviews, activities),
    ].filter((insight): insight is Insight => insight !== null);

    return { insights };
  }

  private applicationVolumeInsight(
    opportunities: Opportunity[],
  ): Insight | null {
    const now = Date.now();
    const currentStart = now - 30 * 86_400_000;
    const previousStart = now - 60 * 86_400_000;
    const applications = opportunities
      .map((opportunity) => opportunity.dateApplied?.getTime())
      .filter(
        (date): date is number => date !== undefined && !Number.isNaN(date),
      );
    const current = applications.filter(
      (date) => date >= currentStart && date <= now,
    ).length;
    const previous = applications.filter(
      (date) => date >= previousStart && date < currentStart,
    ).length;
    if (current === 0 && previous === 0) return null;

    const change =
      previous === 0
        ? null
        : Math.round(((current - previous) / previous) * 100);
    const message =
      change === null
        ? `${current} application${current === 1 ? '' : 's'} recorded in the last 30 days.`
        : `${change >= 0 ? 'Applications increased' : 'Applications decreased'} ${Math.abs(change)}% compared with the previous 30 days.`;
    return {
      id: 'application-volume',
      type: 'application_volume',
      title: 'Application momentum',
      message,
      details: [
        `Current 30-day period: ${current} application${current === 1 ? '' : 's'}`,
        `Previous 30-day period: ${previous} application${previous === 1 ? '' : 's'}`,
      ],
    };
  }

  private roleConversionInsight(
    opportunities: Opportunity[],
    responseIds: Set<string>,
    interviews: Interview[],
  ): Insight | null {
    const groups = this.groupOpportunities(
      opportunities,
      (opportunity) => opportunity.jobTitle,
      responseIds,
    );
    const interviewedIds = new Set(
      interviews.map((interview) => interview.opportunityId),
    );
    const best = [...groups.entries()]
      .map(([label, group]) => ({
        label,
        group,
        rate: this.rate(group.responses.size, group.applications),
        interviews: [...group.responses].filter((id) => interviewedIds.has(id))
          .length,
      }))
      .sort(
        (left, right) =>
          right.rate - left.rate ||
          right.group.applications - left.group.applications ||
          left.label.localeCompare(right.label),
      )[0];
    if (!best) return null;
    return {
      id: 'role-conversion',
      type: 'role_conversion',
      title: 'Strongest role conversion',
      message: `${best.label} has your strongest response rate at ${best.rate}%.`,
      details: [
        `${best.group.applications} application${best.group.applications === 1 ? '' : 's'} for this role`,
        `${best.group.responses.size} recruiter response${best.group.responses.size === 1 ? '' : 's'}`,
        `${best.interviews} interview${best.interviews === 1 ? '' : 's'} reached`,
      ],
    };
  }

  private countryResponseInsight(
    opportunities: Opportunity[],
    responseIds: Set<string>,
  ): Insight | null {
    const groups = this.groupOpportunities(
      opportunities,
      (opportunity) => opportunity.companyCountry?.trim() || 'Unspecified',
      responseIds,
    );
    const best = [...groups.entries()]
      .map(([label, group]) => ({
        label,
        group,
        rate: this.rate(group.responses.size, group.applications),
      }))
      .sort(
        (left, right) =>
          right.rate - left.rate ||
          right.group.applications - left.group.applications ||
          left.label.localeCompare(right.label),
      )[0];
    if (!best) return null;
    return {
      id: 'country-response',
      type: 'country_response',
      title: 'Best response location',
      message: `${best.label} has your strongest response rate at ${best.rate}%.`,
      details: [
        `${best.group.applications} application${best.group.applications === 1 ? '' : 's'} in this location`,
        `${best.group.responses.size} recruiter response${best.group.responses.size === 1 ? '' : 's'}`,
      ],
    };
  }

  private interviewSkillsInsight(
    opportunities: Opportunity[],
    interviews: Interview[],
    activities: Activity[],
  ): Insight | null {
    const interviewedIds = new Set(
      interviews.map((interview) => interview.opportunityId),
    );
    if (interviewedIds.size === 0) return null;
    const textByOpportunity = new Map<string, string>();
    for (const opportunity of opportunities) {
      if (interviewedIds.has(opportunity.id))
        textByOpportunity.set(
          opportunity.id,
          [
            opportunity.jobDescription ?? '',
            ...interviews
              .filter((item) => item.opportunityId === opportunity.id)
              .map((item) => item.notes ?? ''),
            ...activities
              .filter((item) => item.opportunityId === opportunity.id)
              .map((item) => item.description ?? ''),
          ]
            .join(' ')
            .toLowerCase(),
        );
    }
    const matches = SKILL_CATALOG.map((skill) => ({
      name: skill.name,
      count: [...textByOpportunity.values()].filter((text) =>
        skill.aliases.some((alias) => this.containsTerm(text, alias)),
      ).length,
    }))
      .filter((skill) => skill.count > 0)
      .sort(
        (left, right) =>
          right.count - left.count || left.name.localeCompare(right.name),
      )
      .slice(0, 3);
    if (matches.length === 0) return null;
    return {
      id: 'interview-skills',
      type: 'interview_skills',
      title: 'Recurring interview topics',
      message: `${matches.map((match) => match.name).join(', ')} appeared across your interviewed opportunities.`,
      details: matches.map(
        (match) =>
          `${match.name}: ${match.count} interviewed ${match.count === 1 ? 'opportunity' : 'opportunities'}`,
      ),
    };
  }

  private groupOpportunities(
    opportunities: Opportunity[],
    key: (opportunity: Opportunity) => string,
    responseIds: Set<string>,
  ) {
    const groups = new Map<string, Group>();
    for (const opportunity of opportunities.filter(
      (item) => item.dateApplied,
    )) {
      const label = key(opportunity).trim() || 'Unspecified';
      const group = groups.get(label) ?? {
        applications: 0,
        responses: new Set<string>(),
      };
      group.applications += 1;
      if (responseIds.has(opportunity.id)) group.responses.add(opportunity.id);
      groups.set(label, group);
    }
    return groups;
  }

  private getTransitions(activities: Activity[]): StageTransition[] {
    return activities.flatMap((activity) => {
      const match =
        activity.type === 'status_change'
          ? activity.description?.match(/Stage changed from ([^ ]+) to ([^ ]+)/)
          : null;
      return match
        ? [{ opportunityId: activity.opportunityId, to: match[2] }]
        : [];
    });
  }

  private getResponseIds(
    opportunities: Opportunity[],
    transitions: StageTransition[],
  ) {
    const ids = new Set(
      transitions
        .filter((transition) => RESPONSE_STAGES.has(transition.to))
        .map((transition) => transition.opportunityId),
    );
    for (const opportunity of opportunities)
      if (RESPONSE_STAGES.has(opportunity.stage)) ids.add(opportunity.id);
    return ids;
  }

  private rate(responses: number, applications: number) {
    return applications === 0
      ? 0
      : Math.round((responses / applications) * 100);
  }

  private containsTerm(text: string, term: string) {
    return new RegExp(
      `(^|[^a-z0-9+#])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9+#]|$)`,
      'i',
    ).test(text);
  }
}
