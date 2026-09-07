import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from '../interviews/entities/interview.entity.js';
import { Activity } from '../opportunities/entities/activity.entity.js';
import { Opportunity } from '../opportunities/entities/opportunity.entity.js';
import { AnalyticsController } from './controllers/analytics.controller.js';
import { AnalyticsService } from './services/analytics.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity, Interview, Activity])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
