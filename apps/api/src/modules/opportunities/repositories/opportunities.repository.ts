import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from '../entities/opportunity.entity.js';

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

  async findAllForUser(userId: string): Promise<Opportunity[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, userId: string, updateData: Partial<Opportunity>): Promise<Opportunity | null> {
    await this.repository.update({ id, userId }, updateData);
    return this.findOne(id, userId);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.repository.delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }
}
