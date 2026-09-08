import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from '../opportunities/entities/opportunity.entity.js';
import { SalaryIntelligenceController } from './controllers/salary-intelligence.controller.js';
import { SalaryIntelligenceService } from './services/salary-intelligence.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity])],
  controllers: [SalaryIntelligenceController],
  providers: [SalaryIntelligenceService],
})
export class SalaryIntelligenceModule {}
