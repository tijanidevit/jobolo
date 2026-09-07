import { mock } from 'vitest-mock-extended';
import { vi } from 'vitest';
import { Repository } from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity.js';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { Task } from '../../tasks/entities/task.entity.js';
import { DashboardService } from './dashboard.service.js';

describe('DashboardService', () => {
  it('groups today priorities and calculates core metrics', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-07T10:00:00.000Z'));
    const opportunitiesRepository = mock<Repository<Opportunity>>();
    const tasksRepository = mock<Repository<Task>>();
    const interviewsRepository = mock<Repository<Interview>>();
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const today = new Date(now);
    today.setHours(12, 0, 0, 0);

    opportunitiesRepository.find.mockResolvedValue([
      {
        id: 'opportunity-1',
        stage: 'applied',
        dateApplied: now,
        nextAction: 'Follow up',
        nextActionDueDate: today,
      },
      {
        id: 'opportunity-2',
        stage: 'offer',
        dateApplied: null,
        nextAction: null,
      },
    ] as Opportunity[]);
    tasksRepository.find.mockResolvedValue([
      { id: 'task-1', status: 'pending', dueDate: yesterday },
      { id: 'task-2', status: 'pending', dueDate: today },
      { id: 'task-3', status: 'completed', dueDate: yesterday },
    ] as Task[]);
    interviewsRepository.find.mockResolvedValue([
      { id: 'interview-1', scheduledAt: today },
    ] as Interview[]);

    const service = new DashboardService(
      opportunitiesRepository,
      tasksRepository,
      interviewsRepository,
    );
    const result = await service.getToday('user-1');

    expect(result.priorities.overdueTasks).toHaveLength(1);
    expect(result.priorities.dueTodayTasks).toHaveLength(1);
    expect(result.priorities.upcomingInterviews).toHaveLength(1);
    expect(result.activeOpportunities).toHaveLength(1);
    expect(result.metrics.applications).toBe(1);
    expect(result.metrics.finalRounds).toBe(0);
    expect(result.metrics.offers).toBe(1);
    vi.useRealTimers();
  });
});
