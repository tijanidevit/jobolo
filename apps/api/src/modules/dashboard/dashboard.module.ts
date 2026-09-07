import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from '../interviews/entities/interview.entity.js';
import { Opportunity } from '../opportunities/entities/opportunity.entity.js';
import { Task } from '../tasks/entities/task.entity.js';
import { DashboardController } from './controllers/dashboard.controller.js';
import { DashboardService } from './services/dashboard.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity, Task, Interview])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
