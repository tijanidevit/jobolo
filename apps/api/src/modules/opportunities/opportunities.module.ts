import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity.js';
import { OpportunitiesController } from './controllers/opportunities.controller.js';
import { OpportunitiesService } from './services/opportunities.service.js';
import { OpportunitiesRepository } from './repositories/opportunities.repository.js';

import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Opportunity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService, OpportunitiesRepository],
  exports: [OpportunitiesService, OpportunitiesRepository],
})
export class OpportunitiesModule {}
