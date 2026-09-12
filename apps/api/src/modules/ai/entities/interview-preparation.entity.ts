import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('interview_preparations')
@Index(['userId', 'opportunityId', 'createdAt'])
export class InterviewPreparation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  opportunityId: string;

  @Column({ type: 'json' }) likelyQuestions: string[];
  @Column({ type: 'json' }) technicalQuestions: string[];
  @Column({ type: 'json' }) behavioralQuestions: string[];
  @Column({ type: 'json' }) systemDesignQuestions: string[];
  @Column({ type: 'json' }) studyTopics: string[];
  @Column({ type: 'varchar', length: 20 }) provider: 'ai' | 'local';

  @CreateDateColumn() createdAt: Date;
}
