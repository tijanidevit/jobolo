import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from '../repositories/opportunities.repository.js';
import { CreateOpportunityDto } from '../dto/create-opportunity.dto.js';
import { UpdateOpportunityDto } from '../dto/update-opportunity.dto.js';
import { Opportunity } from '../entities/opportunity.entity.js';
import { OpportunityStatus } from '@jobolo/shared';

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

  async findOne(id: string, userId: string): Promise<Opportunity> {
    const opportunity = await this.opportunitiesRepository.findOne(id, userId);
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }
    return opportunity;
  }

  async update(id: string, userId: string, updateDto: UpdateOpportunityDto): Promise<Opportunity> {
    // Verify it exists first
    await this.findOne(id, userId);
    
    const updated = await this.opportunitiesRepository.update(id, userId, updateDto);
    if (!updated) {
      throw new NotFoundException('Opportunity not found after update');
    }
    return updated;
  }

  async changeStage(id: string, userId: string, stage: OpportunityStatus): Promise<Opportunity> {
    // Verify it exists first
    await this.findOne(id, userId);

    const updated = await this.opportunitiesRepository.update(id, userId, { stage });
    if (!updated) {
      throw new NotFoundException('Opportunity not found after update');
    }
    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    // Verify it exists first
    await this.findOne(id, userId);
    
    await this.opportunitiesRepository.delete(id, userId);
  }
}
