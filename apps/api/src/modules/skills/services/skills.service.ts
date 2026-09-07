import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { SkillItemDto } from '../dto/update-skills.dto.js';
import type { SkillSort } from '../dto/skills-query.dto.js';
import { SKILL_CATALOG } from '../constants/skill-catalog.js';
import { SkillsRepository } from '../repositories/skills.repository.js';

@Injectable()
export class SkillsService {
  constructor(
    private readonly skillsRepository: SkillsRepository,
    @InjectRepository(Opportunity)
    private readonly opportunitiesRepository: Repository<Opportunity>,
  ) {}

  replaceSkills(userId: string, skills: SkillItemDto[]) {
    return this.skillsRepository.replaceForUser(
      userId,
      skills.map((item) => ({
        id: item.id,
        skill: item.skill.trim(),
        proficiency: item.proficiency,
      })),
    );
  }

  async getIntelligence(userId: string, sort: SkillSort = 'proficiency-desc') {
    const [opportunities, profile] = await Promise.all([
      this.opportunitiesRepository.find({ where: { userId } }),
      this.skillsRepository.findAllForUser(userId),
    ]);
    const profileBySkill = new Map(
      profile.map((item) => [this.normalizeSkill(item.skill), item]),
    );
    const skillCounts = new Map<string, number>();
    let analyzedOpportunities = 0;

    for (const opportunity of opportunities) {
      const description = opportunity.jobDescription?.toLowerCase();
      if (!description) continue;
      analyzedOpportunities += 1;
      for (const definition of SKILL_CATALOG) {
        if (
          definition.aliases.some((alias) => this.hasSkill(description, alias))
        ) {
          skillCounts.set(
            definition.name,
            (skillCounts.get(definition.name) ?? 0) + 1,
          );
        }
      }
    }

    const catalogSkills = SKILL_CATALOG.map((definition) => {
      const profileSkill = profileBySkill.get(this.normalizeSkill(definition.name));
      return {
        id: profileSkill?.id ?? null,
        skill: profileSkill?.skill ?? definition.name,
        demandCount: skillCounts.get(definition.name) ?? 0,
        proficiency: profileSkill?.proficiency ?? null,
      };
    });
    const customSkills = profile
      .filter((item) => !SKILL_CATALOG.some((definition) => this.normalizeSkill(definition.name) === this.normalizeSkill(item.skill)))
      .map((item) => ({ id: item.id, skill: item.skill, demandCount: 0, proficiency: item.proficiency }));
    const skills = [...catalogSkills, ...customSkills]
      .map((item) => {
        const { id, skill, demandCount, proficiency } = item;
        return {
          id,
          skill,
          demandCount,
          demandPercentage:
            analyzedOpportunities > 0
              ? Number(((demandCount / analyzedOpportunities) * 100).toFixed(1))
              : 0,
          proficiency,
          gap: proficiency === null ? null : Math.max(0, 100 - proficiency),
        };
      })
      .filter((item) => item.demandCount > 0 || item.proficiency !== null)
      .sort(
        (left, right) => {
          const leftValue = sort.startsWith('proficiency')
            ? (left.proficiency ?? 0)
            : left.demandPercentage;
          const rightValue = sort.startsWith('proficiency')
            ? (right.proficiency ?? 0)
            : right.demandPercentage;
          const direction = sort.endsWith('desc') ? -1 : 1;

          return (
            (leftValue - rightValue) * direction ||
            left.skill.localeCompare(right.skill)
          );
        },
      );

    return { skills };
  }

  private normalize(value: string) {
    return value.trim().toLowerCase();
  }

  private normalizeSkill(value: string) {
    const normalized = this.normalize(value).replace(/[^a-z0-9+#]/g, '');
    return normalized.endsWith('s') ? normalized.slice(0, -1) : normalized;
  }

  private hasSkill(description: string, alias: string) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9+#])${escaped}([^a-z0-9+#]|$)`, 'i').test(
      description,
    );
  }
}
