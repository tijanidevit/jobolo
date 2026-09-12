import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from '../opportunities/entities/opportunity.entity.js';
import { Interview } from '../interviews/entities/interview.entity.js';
import { UserSkill } from '../skills/entities/user-skill.entity.js';
import { AiIntelligenceController } from './controllers/ai-intelligence.controller.js';
import { InterviewMemory } from './entities/interview-memory.entity.js';
import { InterviewPreparation } from './entities/interview-preparation.entity.js';
import { OpportunityFitScore } from './entities/opportunity-fit-score.entity.js';
import { AiIntelligenceService } from './services/ai-intelligence.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Opportunity,
      Interview,
      UserSkill,
      OpportunityFitScore,
      InterviewPreparation,
      InterviewMemory,
    ]),
  ],
  controllers: [AiIntelligenceController],
  providers: [AiIntelligenceService],
})
export class AiModule {}
