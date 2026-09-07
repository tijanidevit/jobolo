import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunitiesModule } from '../opportunities/opportunities.module.js';
import { TasksController } from './controllers/tasks.controller.js';
import { Task } from './entities/task.entity.js';
import { TasksRepository } from './repositories/tasks.repository.js';
import { TasksService } from './services/tasks.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), OpportunitiesModule],
  controllers: [TasksController],
  providers: [TasksRepository, TasksService],
})
export class TasksModule {}
