import { afterEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { Repository } from 'typeorm';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { SalaryIntelligenceService } from './salary-intelligence.service.js';

describe('SalaryIntelligenceService', () => {
  afterEach(() => vi.useRealTimers());

  it('keeps salary averages separate when currencies differ', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-08T12:00:00.000Z'));
    const repository = mock<Repository<Opportunity>>();
    repository.find.mockResolvedValue([
      {
        id: 'one',
        jobTitle: 'Backend Engineer',
        companyCountry: 'Nigeria',
        currency: 'USD',
        targetSalary: 100000,
        salaryRangeMin: 90000,
        salaryRangeMax: 110000,
        dateApplied: new Date('2026-08-01T10:00:00.000Z'),
        createdAt: new Date('2026-08-01T10:00:00.000Z'),
      },
      {
        id: 'two',
        jobTitle: 'Frontend Engineer',
        companyCountry: 'Canada',
        currency: 'CAD',
        targetSalary: 120000,
        salaryRangeMin: null,
        salaryRangeMax: null,
        dateApplied: new Date('2026-08-02T10:00:00.000Z'),
        createdAt: new Date('2026-08-02T10:00:00.000Z'),
      },
    ] as Opportunity[]);

    const result = await new SalaryIntelligenceService(
      repository,
    ).getSalaryIntelligence('user-1');

    expect(result.summary).toMatchObject({
      recordedOpportunities: 2,
      currencies: ['CAD', 'USD'],
      averageTargetSalary: null,
    });
    expect(result.currencySummaries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          currency: 'USD',
          averageTargetSalary: 100000,
          averageRangeMidpoint: 100000,
        }),
        expect.objectContaining({
          currency: 'CAD',
          averageTargetSalary: 120000,
        }),
      ]),
    );
    expect(result.byRole[0]).toMatchObject({
      label: 'Backend Engineer',
      currency: 'USD',
    });
  });

  it('returns an empty intelligence response when no salary is recorded', async () => {
    const repository = mock<Repository<Opportunity>>();
    repository.find.mockResolvedValue([
      { targetSalary: null, salaryRangeMin: null, salaryRangeMax: null },
    ] as Opportunity[]);

    await expect(
      new SalaryIntelligenceService(repository).getSalaryIntelligence('user-1'),
    ).resolves.toMatchObject({
      summary: { recordedOpportunities: 0, currencies: [] },
      currencySummaries: [],
      trend: [],
    });
  });
});
