import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import type {
  SalaryBreakdown,
  SalaryIntelligenceResponse,
  SalaryTrend,
} from '../types/salary-intelligence.types.js';

type SalaryRecord = {
  opportunity: Opportunity;
  currency: string;
  target: number | null;
  midpoint: number | null;
};

type SalaryAccumulator = {
  records: number;
  targets: number[];
  midpoints: number[];
};

@Injectable()
export class SalaryIntelligenceService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunitiesRepository: Repository<Opportunity>,
  ) {}

  async getSalaryIntelligence(
    userId: string,
  ): Promise<SalaryIntelligenceResponse> {
    const opportunities = await this.opportunitiesRepository.find({
      where: { userId },
    });
    const records = opportunities
      .map((opportunity) => this.toSalaryRecord(opportunity))
      .filter((record): record is SalaryRecord => record !== null);
    const currencies = [
      ...new Set(records.map((record) => record.currency)),
    ].sort();
    const summary = this.toSummary(records);

    return {
      summary: {
        recordedOpportunities: records.length,
        currencies,
        averageTargetSalary:
          currencies.length === 1 ? summary.averageTargetSalary : null,
        averageRangeMidpoint:
          currencies.length === 1 ? summary.averageRangeMidpoint : null,
      },
      currencySummaries: this.toCurrencySummaries(records),
      trend: this.toTrend(records),
      byRole: this.toBreakdown(
        records,
        (record) => record.opportunity.jobTitle,
      ),
      byCountry: this.toBreakdown(
        records,
        (record) => record.opportunity.companyCountry?.trim() || 'Unspecified',
      ),
    };
  }

  private toSalaryRecord(opportunity: Opportunity): SalaryRecord | null {
    const target = this.numberOrNull(opportunity.targetSalary);
    const minimum = this.numberOrNull(opportunity.salaryRangeMin);
    const maximum = this.numberOrNull(opportunity.salaryRangeMax);
    if (target === null && minimum === null && maximum === null) return null;
    return {
      opportunity,
      currency: opportunity.currency?.trim().toUpperCase() || 'Unspecified',
      target,
      midpoint:
        minimum !== null && maximum !== null
          ? Number(((minimum + maximum) / 2).toFixed(2))
          : (minimum ?? maximum),
    };
  }

  private toCurrencySummaries(records: SalaryRecord[]) {
    const grouped = this.groupByCurrency(records);
    return [...grouped.entries()]
      .map(([currency, items]) => {
        const targets = items
          .map((item) => item.target)
          .filter((value): value is number => value !== null);
        const midpoints = items
          .map((item) => item.midpoint)
          .filter((value): value is number => value !== null);
        return {
          currency,
          records: items.length,
          averageTargetSalary: this.average(targets),
          averageRangeMidpoint: this.average(midpoints),
          lowestTargetSalary: targets.length > 0 ? Math.min(...targets) : null,
          highestTargetSalary: targets.length > 0 ? Math.max(...targets) : null,
        };
      })
      .sort(
        (left, right) =>
          right.records - left.records ||
          left.currency.localeCompare(right.currency),
      );
  }

  private toTrend(records: SalaryRecord[]): SalaryTrend[] {
    const now = new Date();
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1),
    );
    const groups = new Map<string, SalaryAccumulator>();
    for (const record of records) {
      const date =
        record.opportunity.dateApplied ?? record.opportunity.createdAt;
      if (!date || date < start || date > now) continue;
      const period = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
      const key = `${period}|${record.currency}`;
      const group = groups.get(key) ?? {
        records: 0,
        targets: [],
        midpoints: [],
      };
      group.records += 1;
      if (record.target !== null) group.targets.push(record.target);
      if (record.midpoint !== null) group.midpoints.push(record.midpoint);
      groups.set(key, group);
    }
    return [...groups.entries()]
      .map(([key, group]) => {
        const [period, currency] = key.split('|');
        return {
          period,
          currency,
          records: group.records,
          averageTargetSalary: this.average(group.targets),
        };
      })
      .sort(
        (left, right) =>
          left.period.localeCompare(right.period) ||
          left.currency.localeCompare(right.currency),
      );
  }

  private toBreakdown(
    records: SalaryRecord[],
    getLabel: (record: SalaryRecord) => string,
  ): SalaryBreakdown[] {
    const groups = new Map<string, SalaryAccumulator>();
    for (const record of records) {
      const label = getLabel(record).trim() || 'Unspecified';
      const key = `${label}|${record.currency}`;
      const group = groups.get(key) ?? {
        records: 0,
        targets: [],
        midpoints: [],
      };
      group.records += 1;
      if (record.target !== null) group.targets.push(record.target);
      if (record.midpoint !== null) group.midpoints.push(record.midpoint);
      groups.set(key, group);
    }
    return [...groups.entries()]
      .map(([key, group]) => {
        const separator = key.lastIndexOf('|');
        return {
          label: key.slice(0, separator),
          currency: key.slice(separator + 1),
          records: group.records,
          averageTargetSalary: this.average(group.targets),
          averageRangeMidpoint: this.average(group.midpoints),
        };
      })
      .sort(
        (left, right) =>
          right.records - left.records || left.label.localeCompare(right.label),
      );
  }

  private groupByCurrency(records: SalaryRecord[]) {
    const groups = new Map<string, SalaryRecord[]>();
    for (const record of records) {
      const group = groups.get(record.currency) ?? [];
      group.push(record);
      groups.set(record.currency, group);
    }
    return groups;
  }

  private toSummary(records: SalaryRecord[]) {
    return {
      averageTargetSalary: this.average(
        records
          .map((record) => record.target)
          .filter((value): value is number => value !== null),
      ),
      averageRangeMidpoint: this.average(
        records
          .map((record) => record.midpoint)
          .filter((value): value is number => value !== null),
      ),
    };
  }

  private average(values: number[]) {
    return values.length > 0
      ? Number(
          (
            values.reduce((sum, value) => sum + value, 0) / values.length
          ).toFixed(2),
        )
      : null;
  }

  private numberOrNull(value: number | null | undefined) {
    if (value === null || value === undefined || Number.isNaN(Number(value)))
      return null;
    return Number(value);
  }
}
