import { afterEach, vi, describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { Repository } from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity.js';
import { Activity } from '../../opportunities/entities/activity.entity.js';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { InsightsService } from './insights.service.js';

describe('InsightsService', () => {
  afterEach(() => vi.useRealTimers());

  it('returns evidence-backed insights from opportunity history', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-07T12:00:00.000Z'));
    const opportunitiesRepository = mock<Repository<Opportunity>>();
    const interviewsRepository = mock<Repository<Interview>>();
    const activitiesRepository = mock<Repository<Activity>>();
    opportunitiesRepository.find.mockResolvedValue([
      {
        id: 'one',
        jobTitle: 'Backend Engineer',
        companyCountry: 'Nigeria',
        dateApplied: new Date('2026-09-01T10:00:00.000Z'),
        jobDescription: 'Build APIs with TypeScript and PostgreSQL',
        stage: 'interview',
      },
      {
        id: 'two',
        jobTitle: 'Backend Engineer',
        companyCountry: 'Nigeria',
        dateApplied: new Date('2026-08-01T10:00:00.000Z'),
        jobDescription: 'Build APIs with TypeScript',
        stage: 'applied',
      },
    ] as Opportunity[]);
    interviewsRepository.find.mockResolvedValue([
      { opportunityId: 'one', notes: 'Discuss TypeScript architecture' },
    ] as Interview[]);
    activitiesRepository.find.mockResolvedValue([
      {
        opportunityId: 'one',
        type: 'status_change',
        description: 'Stage changed from applied to interview',
      },
    ] as Activity[]);

    const service = new InsightsService(
      opportunitiesRepository,
      interviewsRepository,
      activitiesRepository,
    );
    const result = await service.getInsights('user-1');

    expect(result.insights).toHaveLength(4);
    expect(result.insights[0]).toMatchObject({
      id: 'application-volume',
      type: 'application_volume',
    });
    expect(
      result.insights.find((insight) => insight.type === 'role_conversion'),
    ).toMatchObject({
      message: 'Backend Engineer has your strongest response rate at 50%.',
    });
    expect(
      result.insights.find((insight) => insight.type === 'interview_skills')
        ?.details,
    ).toContain('TypeScript: 1 interviewed opportunity');
  });

  it('returns no insights when the user has no supporting data', async () => {
    const opportunitiesRepository = mock<Repository<Opportunity>>();
    const interviewsRepository = mock<Repository<Interview>>();
    const activitiesRepository = mock<Repository<Activity>>();
    opportunitiesRepository.find.mockResolvedValue([]);
    interviewsRepository.find.mockResolvedValue([]);
    activitiesRepository.find.mockResolvedValue([]);

    const service = new InsightsService(
      opportunitiesRepository,
      interviewsRepository,
      activitiesRepository,
    );

    await expect(service.getInsights('user-1')).resolves.toEqual({
      insights: [],
    });
  });
});
