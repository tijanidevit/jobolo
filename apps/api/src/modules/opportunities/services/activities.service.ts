import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from '../repositories/opportunities.repository.js';
import { ActivitiesRepository } from '../repositories/activities.repository.js';
import { CreateActivityDto } from '../dto/create-activity.dto.js';
import { UpdateActivityDto } from '../dto/update-activity.dto.js';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { extname } from 'node:path';
import { uploadDirectory, uploadFilePath } from '../../../common/files/upload-path.js';
import type { PaginatedResponse } from '@jobolo/shared';
import { MAX_PAGE_SIZE } from '../../../common/dto/pagination-query.dto.js';
import type { Activity } from '../entities/activity.entity.js';

export interface UploadedActivityFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly opportunitiesRepository: OpportunitiesRepository,
    private readonly activitiesRepository: ActivitiesRepository,
  ) {}

  async create(
    userId: string,
    opportunityId: string,
    dto: CreateActivityDto,
    files: UploadedActivityFile[] = [],
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const activity = await this.activitiesRepository.create(
      userId,
      opportunityId,
      dto,
    );
    await this.storeAttachments(activity.id, files);
    return this.activitiesRepository.findOne(userId, opportunityId, activity.id);
  }

  async update(
    userId: string,
    opportunityId: string,
    activityId: string,
    dto: UpdateActivityDto,
    files: UploadedActivityFile[] = [],
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const activity = await this.activitiesRepository.update(
      activityId,
      userId,
      dto,
    );
    if (!activity || activity.opportunityId !== opportunityId)
      throw new NotFoundException('Activity not found');
    await this.storeAttachments(activity.id, files);
    return this.activitiesRepository.findOne(userId, opportunityId, activity.id);
  }

  async findAllForOpportunity(
    userId: string,
    opportunityId: string,
    page = 1,
    limit = MAX_PAGE_SIZE,
  ): Promise<PaginatedResponse<Activity>> {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.activitiesRepository.findAllForOpportunity(
      userId,
      opportunityId,
      page,
      limit,
    );
  }

  async getAttachment(
    userId: string,
    opportunityId: string,
    activityId: string,
    storedName: string,
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const activity = await this.activitiesRepository.findOne(
      userId,
      opportunityId,
      activityId,
    );
    const attachment = activity?.attachments.find(
      (item) => item.storedName === storedName,
    );
    if (!attachment) throw new NotFoundException('Attachment not found');
    return {
      path: uploadFilePath('activities', attachment.storedName),
      mimeType: attachment.mimeType,
    };
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

  private async storeAttachments(activityId: string, files: UploadedActivityFile[]) {
    if (files.length === 0) return;

    const attachmentData = await Promise.all(
      files.map(async (file) => {
        const storedName = `${Date.now()}-${randomUUID()}${extname(file.originalname)}`;
        await fs.mkdir(uploadDirectory('activities'), { recursive: true });
        await fs.writeFile(uploadFilePath('activities', storedName), file.buffer);
        return {
          originalName: file.originalname,
          storedName,
          mimeType: file.mimetype,
          size: file.size,
        };
      }),
    );

    await this.activitiesRepository.addAttachments(activityId, attachmentData);
  }
}
