import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from '../../opportunities/repositories/opportunities.repository.js';
import type { CreateInterviewDto } from '../dto/create-interview.dto.js';
import type { UpdateInterviewDto } from '../dto/update-interview.dto.js';
import { InterviewsRepository } from '../repositories/interviews.repository.js';

@Injectable()
export class InterviewsService {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly opportunitiesRepository: OpportunitiesRepository,
  ) {}

  async findAllForOpportunity(userId: string, opportunityId: string) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.interviewsRepository.findAllForOpportunity(
      userId,
      opportunityId,
    );
  }

  async create(userId: string, opportunityId: string, dto: CreateInterviewDto) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.interviewsRepository.create(userId, opportunityId, dto);
  }

  async update(
    userId: string,
    opportunityId: string,
    interviewId: string,
    dto: UpdateInterviewDto,
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const interview = await this.interviewsRepository.update(
      interviewId,
      userId,
      opportunityId,
      dto,
    );
    if (!interview) throw new NotFoundException('Interview not found');
    return interview;
  }

  async remove(userId: string, opportunityId: string, interviewId: string) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const removed = await this.interviewsRepository.delete(
      interviewId,
      userId,
      opportunityId,
    );
    if (!removed) throw new NotFoundException('Interview not found');
  }

  private async ensureOpportunityBelongsToUser(
    userId: string,
    opportunityId: string,
  ) {
    const opportunity = await this.opportunitiesRepository.findOne(
      opportunityId,
      userId,
    );
    if (!opportunity) throw new NotFoundException('Opportunity not found');
  }
}
