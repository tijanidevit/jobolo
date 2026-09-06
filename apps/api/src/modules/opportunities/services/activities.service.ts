import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from '../repositories/opportunities.repository.js';
import { ActivitiesRepository } from '../repositories/activities.repository.js';
import { CreateActivityDto } from '../dto/create-activity.dto.js';
import { UpdateActivityDto } from '../dto/update-activity.dto.js';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { extname, join } from 'node:path';

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
    if (files.length > 0) {
      const attachmentData = await Promise.all(
        files.map(async (file) => {
          const storedName = `${Date.now()}-${randomUUID()}${extname(file.originalname)}`;
          await fs.mkdir(join(process.cwd(), 'uploads', 'activities'), {
            recursive: true,
          });
          await fs.writeFile(
            join(process.cwd(), 'uploads', 'activities', storedName),
            file.buffer,
          );
          return {
            originalName: file.originalname,
            storedName,
            mimeType: file.mimetype,
            size: file.size,
          };
        }),
      );
      await this.activitiesRepository.addAttachments(
        activity.id,
        attachmentData,
      );
    }
    return this.activitiesRepository
      .findAllForOpportunity(userId, opportunityId)
      .then((items) => items.find((item) => item.id === activity.id));
  }

  async update(
    userId: string,
    opportunityId: string,
    activityId: string,
    dto: UpdateActivityDto,
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const activity = await this.activitiesRepository.update(
      activityId,
      userId,
      dto,
    );
    if (!activity || activity.opportunityId !== opportunityId)
      throw new NotFoundException('Activity not found');
    return activity;
  }

  async findAllForOpportunity(userId: string, opportunityId: string) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.activitiesRepository.findAllForOpportunity(
      userId,
      opportunityId,
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
      path: join(process.cwd(), 'uploads', 'activities', attachment.storedName),
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
}
