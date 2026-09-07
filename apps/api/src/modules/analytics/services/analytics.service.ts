import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity.js';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunitiesRepository: Repository<Opportunity>,
    @InjectRepository(Interview)
    private readonly interviewsRepository: Repository<Interview>,
  ) {}

  async getOverview(userId: string) {
    const [opportunities, interviews] = await Promise.all([
      this.opportunitiesRepository.find({ where: { userId } }),
      this.interviewsRepository.find({ where: { userId } }),
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

    return {
      metrics: {
        opportunities: opportunities.length,
        applications: opportunities.filter((opportunity) => opportunity.dateApplied).length,
        interviews: interviews.length,
        offers: opportunities.filter((opportunity) => ['offer', 'accepted'].includes(opportunity.stage)).length,
      },
      statusDistribution: toBreakdown(statusCounts),
      countryDistribution: toBreakdown(countryCounts),
    };
  }
}
