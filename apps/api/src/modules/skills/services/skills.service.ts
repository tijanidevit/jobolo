import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { SkillProfileItemDto } from '../dto/update-skill-profile.dto.js';
import { SKILL_CATALOG } from '../constants/skill-catalog.js';
import { SkillsRepository } from '../repositories/skills.repository.js';

@Injectable()
export class SkillsService {
  constructor(
    private readonly skillsRepository: SkillsRepository,
    @InjectRepository(Opportunity) private readonly opportunitiesRepository: Repository<Opportunity>,
  ) {}

  getProfile(userId: string) {
    return this.skillsRepository.findAllForUser(userId);
  }

  replaceProfile(userId: string, skills: SkillProfileItemDto[]) {
    return this.skillsRepository.replaceForUser(userId, skills.map((item) => ({ skill: item.skill.trim(), proficiency: item.proficiency })));
  }

  async getIntelligence(userId: string) {
    const [opportunities, profile] = await Promise.all([
      this.opportunitiesRepository.find({ where: { userId } }),
      this.skillsRepository.findAllForUser(userId),
    ]);
    const profileBySkill = new Map(profile.map((item) => [this.normalize(item.skill), item.proficiency]));
    const skillCounts = new Map<string, number>();
    let analyzedOpportunities = 0;

    for (const opportunity of opportunities) {
      const description = opportunity.jobDescription?.toLowerCase();
      if (!description) continue;
      analyzedOpportunities += 1;
      for (const definition of SKILL_CATALOG) {
        if (definition.aliases.some((alias) => this.hasSkill(description, alias))) {
          skillCounts.set(definition.name, (skillCounts.get(definition.name) ?? 0) + 1);
        }
      }
    }

    const skills = [...new Set([...SKILL_CATALOG.map((item) => item.name), ...profile.map((item) => item.skill)])]
      .map((skill) => {
        const demandCount = skillCounts.get(skill) ?? 0;
        const proficiency = profileBySkill.get(this.normalize(skill)) ?? null;
        return {
          skill,
          demandCount,
          demandPercentage: analyzedOpportunities > 0 ? Number(((demandCount / analyzedOpportunities) * 100).toFixed(1)) : 0,
          proficiency,
          gap: proficiency === null ? null : Math.max(0, 100 - proficiency),
        };
      })
      .filter((item) => item.demandCount > 0 || item.proficiency !== null)
      .sort((left, right) => right.demandCount - left.demandCount || left.skill.localeCompare(right.skill));

    return { analyzedOpportunities, profile, skills };
  }

  private normalize(value: string) { return value.trim().toLowerCase(); }

  private hasSkill(description: string, alias: string) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9+#])${escaped}([^a-z0-9+#]|$)`, 'i').test(description);
  }
}
