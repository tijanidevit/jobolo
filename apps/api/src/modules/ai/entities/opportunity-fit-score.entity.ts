import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('opportunity_fit_scores')
@Index(['userId', 'opportunityId', 'createdAt'])
export class OpportunityFitScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  opportunityId: string;

  @Column({ type: 'tinyint' }) overallScore: number;
  @Column({ type: 'tinyint' }) technicalSkillsScore: number;
  @Column({ type: 'tinyint' }) experienceScore: number;
  @Column({ type: 'tinyint' }) seniorityScore: number;
  @Column({ type: 'tinyint' }) industryScore: number;
  @Column({ type: 'tinyint' }) locationScore: number;
  @Column({ type: 'json' }) matchedSkills: string[];
  @Column({ type: 'json' }) missingSkills: string[];
  @Column({ type: 'text' }) rationale: string;
  @Column({ type: 'varchar', length: 20 }) provider: 'ai' | 'local';

  @CreateDateColumn() createdAt: Date;
}
