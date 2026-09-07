import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Opportunity } from '../entities/opportunity.entity.js';
import type { OpportunityQueryDto } from '../dto/opportunity-query.dto.js';

@Injectable()
export class OpportunitiesRepository {
  constructor(
    @InjectRepository(Opportunity)
    private readonly repository: Repository<Opportunity>,
  ) {}

  async create(opportunityData: Partial<Opportunity>): Promise<Opportunity> {
    const opportunity = this.repository.create(opportunityData);
    return this.repository.save(opportunity);
  }

  async findOne(id: string, userId: string): Promise<Opportunity | null> {
    return this.repository.findOne({ where: { id, userId } });
  }

  async findAllForUser(
    userId: string,
    query: OpportunityQueryDto = {},
  ): Promise<Opportunity[]> {
    const builder = this.repository
      .createQueryBuilder('opportunity')
      .where('opportunity.userId = :userId', { userId })
      .orderBy('opportunity.createdAt', 'DESC');

    if (query.q) {
      builder.andWhere(
        '(opportunity.companyName LIKE :search OR opportunity.jobTitle LIKE :search OR opportunity.jobDescription LIKE :search OR opportunity.location LIKE :search)',
        { search: `%${query.q.trim()}%` },
      );
    }
    if (query.companyName)
      builder.andWhere('opportunity.companyName LIKE :companyName', {
        companyName: `%${query.companyName.trim()}%`,
      });
    if (query.jobTitle)
      builder.andWhere('opportunity.jobTitle LIKE :jobTitle', {
        jobTitle: `%${query.jobTitle.trim()}%`,
      });
    if (query.companyCountry)
      builder.andWhere('opportunity.companyCountry = :companyCountry', {
        companyCountry: query.companyCountry,
      });
    if (query.source)
      builder.andWhere('opportunity.source LIKE :source', {
        source: `%${query.source.trim()}%`,
      });
    if (query.stage)
      builder.andWhere('opportunity.stage = :stage', { stage: query.stage });
    if (query.priority)
      builder.andWhere('opportunity.priority = :priority', {
        priority: query.priority,
      });
    if (query.workArrangement)
      builder.andWhere('opportunity.workArrangement = :workArrangement', {
        workArrangement: query.workArrangement,
      });
    if (query.employmentType)
      builder.andWhere('opportunity.employmentType = :employmentType', {
        employmentType: query.employmentType,
      });
    if (query.salaryMin !== undefined)
      builder.andWhere(
        '(opportunity.salaryRangeMax IS NULL OR opportunity.salaryRangeMax >= :salaryMin)',
        { salaryMin: query.salaryMin },
      );
    if (query.salaryMax !== undefined)
      builder.andWhere(
        '(opportunity.salaryRangeMin IS NULL OR opportunity.salaryRangeMin <= :salaryMax)',
        { salaryMax: query.salaryMax },
      );

    return builder.getMany();
  }

  async update(
    id: string,
    userId: string,
    updateData: Partial<Opportunity>,
  ): Promise<UpdateResult> {
    return this.repository.update(
      { id, userId },
      {
        ...updateData,
        ...(updateData.nextAction !== undefined
          ? { nextAction: updateData.nextAction?.trim() || null }
          : {}),
        ...(updateData.nextActionDueDate !== undefined
          ? { nextActionDueDate: updateData.nextActionDueDate ?? null }
          : {}),
      },
    );
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.repository.delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }
}
