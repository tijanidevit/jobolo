import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunitiesModule } from '../opportunities/opportunities.module.js';
import { InterviewsController } from './controllers/interviews.controller.js';
import { Interview } from './entities/interview.entity.js';
import { InterviewsRepository } from './repositories/interviews.repository.js';
import { InterviewsService } from './services/interviews.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Interview]), OpportunitiesModule],
  controllers: [InterviewsController],
  providers: [InterviewsRepository, InterviewsService],
})
export class InterviewsModule {}
