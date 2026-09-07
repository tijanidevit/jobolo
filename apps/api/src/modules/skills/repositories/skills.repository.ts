import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSkill } from '../entities/user-skill.entity.js';

@Injectable()
export class SkillsRepository {
  constructor(@InjectRepository(UserSkill) private readonly repository: Repository<UserSkill>) {}

  findAllForUser(userId: string) {
    return this.repository.find({ where: { userId }, order: { skill: 'ASC' } });
  }

  async replaceForUser(userId: string, skills: Array<{ skill: string; proficiency: number }>) {
    await this.repository.delete({ userId });
    if (skills.length === 0) return [];
    return this.repository.save(skills.map((item) => this.repository.create({ userId, ...item })));
  }
}
