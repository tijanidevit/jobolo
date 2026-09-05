import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity.js';
import { OpportunitiesController } from './controllers/opportunities.controller.js';
import { OpportunitiesService } from './services/opportunities.service.js';
import { OpportunitiesRepository } from './repositories/opportunities.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity])],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService, OpportunitiesRepository],
  exports: [OpportunitiesService, OpportunitiesRepository],
})
export class OpportunitiesModule {}
