import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity.js';
import type { CreateActivityDto } from '../dto/create-activity.dto.js';
import type { UpdateActivityDto } from '../dto/update-activity.dto.js';
import type { ActivityAttachment } from '../entities/activity-attachment.entity.js';

@Injectable()
export class ActivitiesRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
  ) {}

  async create(
    userId: string,
    opportunityId: string,
    data: CreateActivityDto,
  ): Promise<Activity> {
    const activity = this.repository.create({
      ...data,
      userId,
      opportunityId,
      description: data.description ?? null,
    });
    return this.repository.save(activity);
  }

  async findAllForOpportunity(
    userId: string,
    opportunityId: string,
  ): Promise<Activity[]> {
    return this.repository.find({
      where: { userId, opportunityId },
      relations: { attachments: true },
      order: { occurredAt: 'DESC', createdAt: 'DESC' },
    });
  }

  async update(id: string, userId: string, data: UpdateActivityDto) {
    await this.repository.update({ id, userId }, data);
    return this.repository.findOne({
      where: { id, userId },
      relations: { attachments: true },
    });
  }

  async findOne(userId: string, opportunityId: string, activityId: string) {
    return this.repository.findOne({
      where: { id: activityId, userId, opportunityId },
      relations: { attachments: true },
    });
  }

  async addAttachments(
    activityId: string,
    attachments: Array<Partial<ActivityAttachment>>,
  ) {
    const activity = await this.repository.findOneByOrFail({ id: activityId });
    activity.attachments = [
      ...(activity.attachments ?? []),
      ...(attachments.map((attachment) => ({
        ...attachment,
        activityId,
      })) as ActivityAttachment[]),
    ];
    return this.repository.save(activity);
  }
}
