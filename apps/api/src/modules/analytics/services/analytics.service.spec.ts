import { mock } from 'vitest-mock-extended';
import { Repository } from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity.js';
import { Activity } from '../../opportunities/entities/activity.entity.js';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { AnalyticsService } from './analytics.service.js';

describe('AnalyticsService', () => {
  it('returns metrics and sorted distributions for the user', async () => {
    const opportunitiesRepository = mock<Repository<Opportunity>>();
    const interviewsRepository = mock<Repository<Interview>>();
    const activitiesRepository = mock<Repository<Activity>>();
    opportunitiesRepository.find.mockResolvedValue([
      { stage: 'applied', dateApplied: new Date(), companyCountry: 'Nigeria' },
      { stage: 'offer', dateApplied: new Date(), companyCountry: 'Nigeria' },
      { stage: 'discovered', dateApplied: null, companyCountry: null },
    ] as Opportunity[]);
    interviewsRepository.find.mockResolvedValue([
      { id: 'interview-1' },
    ] as Interview[]);
    activitiesRepository.find.mockResolvedValue([]);

    const service = new AnalyticsService(
      opportunitiesRepository,
      interviewsRepository,
      activitiesRepository,
    );
    const result = await service.getOverview('user-1');

    expect(result.metrics).toEqual({
      opportunities: 3,
      applications: 2,
      interviews: 1,
      offers: 1,
    });
    expect(result.statusDistribution[0]).toEqual({
      label: 'applied',
      count: 1,
    });
    expect(result.countryDistribution[0]).toEqual({
      label: 'Nigeria',
      count: 2,
    });
    expect(result.countryDistribution[1]).toEqual({
      label: 'Unspecified',
      count: 1,
    });
    expect(result.careerIntelligence.rolePerformance[0]).toMatchObject({
      label: 'Unspecified',
      applications: 2,
    });
  });

  it('calculates conversion, response timing, and salary analytics', async () => {
    const opportunitiesRepository = mock<Repository<Opportunity>>();
    const interviewsRepository = mock<Repository<Interview>>();
    const activitiesRepository = mock<Repository<Activity>>();
    const appliedAt = new Date('2026-09-01T10:00:00.000Z');
    const responseAt = new Date('2026-09-03T10:00:00.000Z');

    opportunitiesRepository.find.mockResolvedValue([
      {
        id: 'opportunity-1',
        stage: 'interview',
        dateApplied: appliedAt,
        companyCountry: 'Nigeria',
        jobTitle: 'Backend Engineer',
        source: 'Referral',
        companySize: 'Startup',
        salaryRangeMin: 80000,
        salaryRangeMax: 100000,
        currency: 'USD',
      },
      {
        id: 'opportunity-2',
        stage: 'applied',
        dateApplied: appliedAt,
        companyCountry: 'Nigeria',
        jobTitle: 'Frontend Engineer',
        source: 'LinkedIn',
        companySize: 'Enterprise',
        salaryRangeMin: 60000,
        salaryRangeMax: 60000,
        currency: 'USD',
      },
    ] as Opportunity[]);
    interviewsRepository.find.mockResolvedValue([
      { id: 'interview-1', opportunityId: 'opportunity-1' },
    ] as Interview[]);
    activitiesRepository.find.mockResolvedValue([
      {
        opportunityId: 'opportunity-1',
        type: 'status_change',
        description: 'Stage changed from applied to interview',
        occurredAt: responseAt,
      },
    ] as Activity[]);

    const service = new AnalyticsService(
      opportunitiesRepository,
      interviewsRepository,
      activitiesRepository,
    );
    const result = await service.getOverview('user-1');

    expect(result.advanced.responseRate).toBe(50);
    expect(result.advanced.interviewConversionRate).toBe(50);
    expect(result.advanced.averageTimeToResponseDays).toBe(2);
    expect(result.advanced.averageSalary).toBe(75000);
    expect(result.advanced.salaryCurrency).toBe('USD');
    expect(
      result.advanced.successBySource.find((row) => row.label === 'Referral'),
    ).toMatchObject({ responseRate: 100 });
    expect(result.careerIntelligence.rolePerformance[0]).toMatchObject({
      label: 'Backend Engineer',
      interviewRate: 100,
      averageSalary: 90000,
      salaryCurrency: 'USD',
    });
    expect(result.careerIntelligence.countryPerformance[0]).toMatchObject({
      label: 'Nigeria',
      interviewRate: 50,
    });
  });
});
