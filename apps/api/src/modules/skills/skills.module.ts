import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from '../opportunities/entities/opportunity.entity.js';
import { SkillsController } from './controllers/skills.controller.js';
import { UserSkill } from './entities/user-skill.entity.js';
import { SkillsRepository } from './repositories/skills.repository.js';
import { SkillsService } from './services/skills.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserSkill, Opportunity])],
  controllers: [SkillsController],
  providers: [SkillsRepository, SkillsService],
})
export class SkillsModule {}
