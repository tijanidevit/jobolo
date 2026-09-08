import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from '../interviews/entities/interview.entity.js';
import { Activity } from '../opportunities/entities/activity.entity.js';
import { Opportunity } from '../opportunities/entities/opportunity.entity.js';
import { InsightsController } from './controllers/insights.controller.js';
import { InsightsService } from './services/insights.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity, Interview, Activity])],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
