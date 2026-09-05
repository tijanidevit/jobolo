import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from '../repositories/opportunities.repository.js';
import { CreateOpportunityDto } from '../dto/create-opportunity.dto.js';
import { UpdateOpportunityDto } from '../dto/update-opportunity.dto.js';
import { Opportunity } from '../entities/opportunity.entity.js';
import { UpdateResult } from 'typeorm';
import type { OpportunityStatus } from '@jobolo/shared';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly opportunitiesRepository: OpportunitiesRepository) {}

  async create(userId: string, createDto: CreateOpportunityDto): Promise<Opportunity> {
    return this.opportunitiesRepository.create({
      ...createDto,
      userId,
    });
  }

  async findAllForUser(userId: string): Promise<Opportunity[]> {
    return this.opportunitiesRepository.findAllForUser(userId);
  }

  private async getOpportunity(id: string, userId: string): Promise<Opportunity> {
    const opportunity = await this.opportunitiesRepository.findOne(id, userId);
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }
    return opportunity;
  }

  async findOne(id: string, userId: string): Promise<Opportunity> {
    return this.getOpportunity(id, userId);
  }

  async update(id: string, userId: string, updateDto: UpdateOpportunityDto): Promise<UpdateResult> {

    await this.getOpportunity(id, userId);
    
    return this.opportunitiesRepository.update(id, userId, updateDto);
  }

  async changeStage(id: string, userId: string, stage: OpportunityStatus): Promise<UpdateResult> {

    await this.getOpportunity(id, userId);

    return this.opportunitiesRepository.update(id, userId, { stage });
  }

  async remove(id: string, userId: string): Promise<void> {

    await this.getOpportunity(id, userId);
    
    await this.opportunitiesRepository.delete(id, userId);
  }
}
