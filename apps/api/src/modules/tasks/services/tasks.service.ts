import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from '../../opportunities/repositories/opportunities.repository.js';
import type { CreateTaskDto } from '../dto/create-task.dto.js';
import type { UpdateTaskDto } from '../dto/update-task.dto.js';
import { TasksRepository } from '../repositories/tasks.repository.js';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly opportunitiesRepository: OpportunitiesRepository,
  ) {}

  async findAllForOpportunity(userId: string, opportunityId: string) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.tasksRepository.findAllForOpportunity(userId, opportunityId);
  }

  async create(userId: string, opportunityId: string, dto: CreateTaskDto) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.tasksRepository.create(userId, opportunityId, dto);
  }

  async update(
    userId: string,
    opportunityId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const task = await this.tasksRepository.update(
      taskId,
      userId,
      opportunityId,
      dto,
    );
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(userId: string, opportunityId: string, taskId: string) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const removed = await this.tasksRepository.delete(
      taskId,
      userId,
      opportunityId,
    );
    if (!removed) throw new NotFoundException('Task not found');
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
