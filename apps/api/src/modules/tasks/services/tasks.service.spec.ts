import { NotFoundException } from '@nestjs/common';
import { mock } from 'vitest-mock-extended';
import { OpportunitiesRepository } from '../../opportunities/repositories/opportunities.repository.js';
import { TasksRepository } from '../repositories/tasks.repository.js';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepository: Mocked<TasksRepository>;
  let opportunitiesRepository: Mocked<OpportunitiesRepository>;

  beforeEach(() => {
    tasksRepository = mock<TasksRepository>();
    opportunitiesRepository = mock<OpportunitiesRepository>();
    service = new TasksService(tasksRepository, opportunitiesRepository);
  });

  it('returns tasks for an owned opportunity', async () => {
    const tasks = [{ id: 'task-1' }];
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    tasksRepository.findAllForOpportunity.mockResolvedValueOnce(tasks as never);

    await expect(service.findAllForOpportunity('user-1', 'opportunity-1')).resolves.toEqual(tasks);
  });

  it('creates a task for an owned opportunity', async () => {
    const dto = { title: 'Follow up with recruiter', priority: 'high' as const };
    const task = { id: 'task-1', ...dto };
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    tasksRepository.create.mockResolvedValueOnce(task as never);

    await expect(service.create('user-1', 'opportunity-1', dto)).resolves.toEqual(task);
  });

  it('updates a task owned by the user', async () => {
    const updated = { id: 'task-1', status: 'completed' };
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    tasksRepository.update.mockResolvedValueOnce(updated as never);

    await expect(
      service.update('user-1', 'opportunity-1', 'task-1', { status: 'completed' }),
    ).resolves.toEqual(updated);
  });

  it('rejects access when the opportunity belongs to another user', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce(null);

    await expect(service.findAllForOpportunity('user-1', 'opportunity-1')).rejects.toThrow(
      NotFoundException,
    );
    expect(tasksRepository.findAllForOpportunity).not.toHaveBeenCalled();
  });

  it('rejects deleting a missing task', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    tasksRepository.delete.mockResolvedValueOnce(false);

    await expect(service.remove('user-1', 'opportunity-1', 'task-1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
