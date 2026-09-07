import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateTaskDto } from '../dto/create-task.dto.js';
import type { UpdateTaskDto } from '../dto/update-task.dto.js';
import { Task } from '../entities/task.entity.js';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  findAllForOpportunity(userId: string, opportunityId: string) {
    return this.repository.find({
      where: { userId, opportunityId },
      order: { status: 'ASC', dueDate: 'ASC', createdAt: 'ASC' },
    });
  }

  create(userId: string, opportunityId: string, data: CreateTaskDto) {
    return this.repository.save(
      this.repository.create({
        userId,
        opportunityId,
        ...data,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        priority: data.priority ?? 'medium',
        status: data.status ?? 'pending',
        dueDate: data.dueDate ?? null,
        reminderAt: data.reminderAt ?? null,
      }),
    );
  }

  async update(
    id: string,
    userId: string,
    opportunityId: string,
    data: UpdateTaskDto,
  ) {
    await this.repository.update(
      { id, userId, opportunityId },
      {
        ...data,
        ...(data.title !== undefined ? { title: data.title.trim() } : {}),
        ...(data.description !== undefined
          ? { description: data.description.trim() || null }
          : {}),
        ...(data.dueDate !== undefined
          ? { dueDate: data.dueDate ?? null }
          : {}),
        ...(data.reminderAt !== undefined
          ? { reminderAt: data.reminderAt ?? null }
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
