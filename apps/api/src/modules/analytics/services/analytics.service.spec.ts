import { mock } from 'vitest-mock-extended';
import { Repository } from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity.js';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { AnalyticsService } from './analytics.service.js';

describe('AnalyticsService', () => {
  it('returns metrics and sorted distributions for the user', async () => {
    const opportunitiesRepository = mock<Repository<Opportunity>>();
    const interviewsRepository = mock<Repository<Interview>>();
    opportunitiesRepository.find.mockResolvedValue([
      { stage: 'applied', dateApplied: new Date(), companyCountry: 'Nigeria' },
      { stage: 'offer', dateApplied: new Date(), companyCountry: 'Nigeria' },
      { stage: 'discovered', dateApplied: null, companyCountry: null },
    ] as Opportunity[]);
    interviewsRepository.find.mockResolvedValue([{ id: 'interview-1' }] as Interview[]);

    const service = new AnalyticsService(opportunitiesRepository, interviewsRepository);
    const result = await service.getOverview('user-1');

    expect(result.metrics).toEqual({ opportunities: 3, applications: 2, interviews: 1, offers: 1 });
    expect(result.statusDistribution[0]).toEqual({ label: 'applied', count: 1 });
    expect(result.countryDistribution[0]).toEqual({ label: 'Nigeria', count: 2 });
    expect(result.countryDistribution[1]).toEqual({ label: 'Unspecified', count: 1 });
  });
});
