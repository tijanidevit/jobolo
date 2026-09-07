import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../../interviews/entities/interview.entity.js';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { Task } from '../../tasks/entities/task.entity.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunitiesRepository: Repository<Opportunity>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Interview)
    private readonly interviewsRepository: Repository<Interview>,
  ) {}

  async getToday(userId: string) {
    const [opportunities, tasks, interviews] = await Promise.all([
      this.opportunitiesRepository.find({
        where: { userId },
        order: { updatedAt: 'DESC' },
      }),
      this.tasksRepository.find({
        where: { userId },
        order: { dueDate: 'ASC' },
      }),
      this.interviewsRepository.find({
        where: { userId },
        order: { scheduledAt: 'ASC' },
      }),
    ]);
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);
    const isActive = (stage: string) =>
      ![
        'accepted',
        'declined',
        'rejected',
        'withdrawn',
        'ghosted',
        'expired',
      ].includes(stage);
    const pendingTasks = tasks.filter((task) => task.status === 'pending');
    const overdueTasks = pendingTasks.filter(
      (task) => task.dueDate && task.dueDate < now,
    );
    const dueTodayTasks = pendingTasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate >= todayStart &&
        task.dueDate < tomorrowStart,
    );
    const upcomingInterviews = interviews
      .filter((interview) => interview.scheduledAt >= todayStart)
      .slice(0, 10);
    const activeOpportunities = opportunities
      .filter(
        (opportunity) => isActive(opportunity.stage) && opportunity.nextAction,
      )
      .slice(0, 10);

    return {
      priorities: { overdueTasks, dueTodayTasks, upcomingInterviews },
      activeOpportunities,
      metrics: {
        applications: opportunities.filter(
          (opportunity) => opportunity.dateApplied,
        ).length,
        interviews: interviews.length,
        finalRounds: opportunities.filter(
          (opportunity) => opportunity.stage === 'final_round',
        ).length,
        offers: opportunities.filter((opportunity) =>
          ['offer', 'accepted'].includes(opportunity.stage),
        ).length,
        applicationsThisWeek: opportunities.filter(
          (opportunity) =>
            opportunity.dateApplied && opportunity.dateApplied >= weekStart,
        ).length,
      },
    };
  }
}
