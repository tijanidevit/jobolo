import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../entities/interview.entity.js';
import type { CreateInterviewDto } from '../dto/create-interview.dto.js';
import type { UpdateInterviewDto } from '../dto/update-interview.dto.js';

@Injectable()
export class InterviewsRepository {
  constructor(
    @InjectRepository(Interview)
    private readonly repository: Repository<Interview>,
  ) {}

  findAllForOpportunity(userId: string, opportunityId: string) {
    return this.repository.find({
      where: { userId, opportunityId },
      order: { scheduledAt: 'ASC', createdAt: 'ASC' },
    });
  }

  create(userId: string, opportunityId: string, data: CreateInterviewDto) {
    return this.repository.save(
      this.repository.create({
        userId,
        opportunityId,
        ...data,
        interviewers: data.interviewers?.trim() || null,
        meetingLocation: data.meetingLocation?.trim() || null,
        stage: data.stage?.trim() || null,
        notes: data.notes?.trim() || null,
        durationMinutes: data.durationMinutes ?? null,
        performanceRating: data.performanceRating ?? null,
      }),
    );
  }

  async update(
    id: string,
    userId: string,
    opportunityId: string,
    data: UpdateInterviewDto,
  ) {
    await this.repository.update(
      { id, userId, opportunityId },
      {
        ...data,
        ...(data.type !== undefined ? { type: data.type.trim() } : {}),
        ...(data.interviewers !== undefined
          ? { interviewers: data.interviewers.trim() || null }
          : {}),
        ...(data.meetingLocation !== undefined
          ? { meetingLocation: data.meetingLocation.trim() || null }
          : {}),
        ...(data.stage !== undefined
          ? { stage: data.stage.trim() || null }
          : {}),
        ...(data.notes !== undefined
          ? { notes: data.notes.trim() || null }
          : {}),
        ...(data.durationMinutes !== undefined
          ? { durationMinutes: data.durationMinutes ?? null }
          : {}),
        ...(data.performanceRating !== undefined
          ? { performanceRating: data.performanceRating ?? null }
          : {}),
      },
    );
    return this.findOne(id, userId, opportunityId);
  }

  findOne(id: string, userId: string, opportunityId: string) {
    return this.repository.findOne({ where: { id, userId, opportunityId } });
  }

  async delete(id: string, userId: string, opportunityId: string) {
    const result = await this.repository.delete({ id, userId, opportunityId });
    return (result.affected ?? 0) > 0;
  }
}
