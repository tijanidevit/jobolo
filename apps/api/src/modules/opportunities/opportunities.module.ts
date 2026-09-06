import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity.js';
import { Activity } from './entities/activity.entity.js';
import { ActivityAttachment } from './entities/activity-attachment.entity.js';
import { OpportunitiesController } from './controllers/opportunities.controller.js';
import { ActivitiesController } from './controllers/activities.controller.js';
import { OpportunitiesService } from './services/opportunities.service.js';
import { ActivitiesService } from './services/activities.service.js';
import { OpportunitiesRepository } from './repositories/opportunities.repository.js';
import { ActivitiesRepository } from './repositories/activities.repository.js';

import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Opportunity, Activity, ActivityAttachment]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OpportunitiesController, ActivitiesController],
  providers: [
    OpportunitiesService,
    OpportunitiesRepository,
    ActivitiesService,
    ActivitiesRepository,
  ],
  exports: [OpportunitiesService, OpportunitiesRepository],
})
export class OpportunitiesModule {}
