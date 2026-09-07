import { mock } from 'vitest-mock-extended';
import { Repository } from 'typeorm';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { SkillsRepository } from '../repositories/skills.repository.js';
import { SkillsService } from './skills.service.js';

describe('SkillsService', () => {
  it('calculates demand and proficiency gaps from owned opportunities', async () => {
    const skillsRepository = mock<SkillsRepository>();
    const opportunitiesRepository = mock<Repository<Opportunity>>();
    skillsRepository.findAllForUser.mockResolvedValue([
      { id: 'skill-1', skill: 'TypeScript', proficiency: 60 },
    ] as never);
    opportunitiesRepository.find.mockResolvedValue([
      { jobDescription: 'Strong TypeScript and React experience required.' },
      { jobDescription: 'Experience with TypeScript preferred.' },
      { jobDescription: null },
    ] as Opportunity[]);

    const service = new SkillsService(
      skillsRepository,
      opportunitiesRepository,
    );
    const result = await service.getIntelligence('user-1');

    expect(
      result.skills.find((skill) => skill.skill === 'TypeScript'),
    ).toMatchObject({
      demandCount: 2,
      demandPercentage: 100,
      proficiency: 60,
      gap: 40,
    });
    expect(
      result.skills.find((skill) => skill.skill === 'React'),
    ).toMatchObject({ demandCount: 1 });

    const demandSorted = await service.getIntelligence('user-1', 'demand-desc');
    expect(demandSorted.skills[0]).toMatchObject({
      skill: 'TypeScript',
      demandCount: 2,
    });

    const leastProficient = await service.getIntelligence(
      'user-1',
      'proficiency-asc',
    );
    expect(leastProficient.skills[0]).toMatchObject({
      skill: 'React',
      proficiency: null,
    });
  });
});
