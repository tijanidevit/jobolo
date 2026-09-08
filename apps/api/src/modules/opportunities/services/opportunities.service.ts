import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpportunitiesRepository } from '../repositories/opportunities.repository.js';
import { ActivitiesRepository } from '../repositories/activities.repository.js';
import { CreateOpportunityDto } from '../dto/create-opportunity.dto.js';
import { UpdateOpportunityDto } from '../dto/update-opportunity.dto.js';
import { Opportunity } from '../entities/opportunity.entity.js';
import { UpdateResult } from 'typeorm';
import type { OpportunityStatus } from '@jobolo/shared';
import type { OpportunityQueryDto } from '../dto/opportunity-query.dto.js';
import { Resume } from '../../resumes/entities/resume.entity.js';
import { CoverLetter } from '../../cover-letters/entities/cover-letter.entity.js';

@Injectable()
export class OpportunitiesService {
  constructor(
    private readonly opportunitiesRepository: OpportunitiesRepository,
    private readonly activitiesRepository: ActivitiesRepository,
    @InjectRepository(Resume)
    private readonly resumesRepository: Repository<Resume>,
    @InjectRepository(CoverLetter)
    private readonly coverLettersRepository: Repository<CoverLetter>,
  ) {}

  async create(
    userId: string,
    createDto: CreateOpportunityDto,
  ): Promise<Opportunity> {
    await this.ensureResumeBelongsToUser(userId, createDto.resumeId);
    await this.ensureCoverLetterBelongsToUser(userId, createDto.coverLetterId);
    const opportunity = await this.opportunitiesRepository.create({
      ...createDto,
      userId,
    });
    await this.activitiesRepository.create(userId, opportunity.id, {
      type: 'status_change',
      title: 'Opportunity created',
      description: `Started in ${opportunity.stage}`,
      occurredAt: new Date(),
    });
    return opportunity;
  }

  async findAllForUser(
    userId: string,
    query: OpportunityQueryDto = {},
  ): Promise<Opportunity[]> {
    return this.opportunitiesRepository.findAllForUser(userId, query);
  }

  private async getOpportunity(
    id: string,
    userId: string,
  ): Promise<Opportunity> {
    const opportunity = await this.opportunitiesRepository.findOne(id, userId);
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }
    return opportunity;
  }

  async findOne(id: string, userId: string): Promise<Opportunity> {
    return this.getOpportunity(id, userId);
  }

  async update(
    id: string,
    userId: string,
    updateDto: UpdateOpportunityDto,
  ): Promise<UpdateResult> {
    const opportunity = await this.getOpportunity(id, userId);
    await this.ensureResumeBelongsToUser(userId, updateDto.resumeId);
    await this.ensureCoverLetterBelongsToUser(userId, updateDto.coverLetterId);
    const result = await this.opportunitiesRepository.update(
      id,
      userId,
      updateDto,
    );
    if (updateDto.stage && updateDto.stage !== opportunity.stage) {
      await this.recordStageChange(userId, opportunity, updateDto.stage);
    }
    return result;
  }

  async changeStage(
    id: string,
    userId: string,
    stage: OpportunityStatus,
  ): Promise<UpdateResult> {
    const opportunity = await this.getOpportunity(id, userId);
    if (opportunity.stage === stage) {
      return { affected: 0, raw: [], generatedMaps: [] };
    }

    const result = await this.opportunitiesRepository.update(id, userId, {
      stage,
    });
    await this.recordStageChange(userId, opportunity, stage);
    return result;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.getOpportunity(id, userId);

    await this.opportunitiesRepository.delete(id, userId);
  }

  private async recordStageChange(
    userId: string,
    opportunity: Opportunity,
    nextStage: OpportunityStatus,
  ) {
    await this.activitiesRepository.create(userId, opportunity.id, {
      type: 'status_change',
      title: `Stage changed to ${nextStage}`,
      description: `Stage changed from ${opportunity.stage} to ${nextStage}`,
      occurredAt: new Date(),
    });
  }

  private async ensureResumeBelongsToUser(
    userId: string,
    resumeId?: string | null,
  ) {
    if (!resumeId) return;
    const resume = await this.resumesRepository.findOne({
      where: { id: resumeId, userId },
    });
    if (!resume) throw new NotFoundException('Resume not found');
  }

  private async ensureCoverLetterBelongsToUser(
    userId: string,
    coverLetterId?: string | null,
  ) {
    if (!coverLetterId) return;
    const coverLetter = await this.coverLettersRepository.findOne({
      where: { id: coverLetterId, userId },
    });
    if (!coverLetter) throw new NotFoundException('Cover letter not found');
  }
}
