import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('interview_memories')
@Index(['userId', 'interviewId', 'createdAt'])
export class InterviewMemory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  opportunityId: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  interviewId: string;

  @Column({ type: 'text' }) sourceText: string;
  @Column({ type: 'json' }) interviewers: string[];
  @Column({ type: 'json' }) questions: string[];
  @Column({ type: 'json' }) topics: string[];
  @Column({ type: 'json' }) commitments: string[];
  @Column({ type: 'json' }) followUpActions: string[];
  @Column({ type: 'json' }) weaknesses: string[];
  @Column({ type: 'varchar', length: 20 }) provider: 'ai' | 'local';

  @CreateDateColumn() createdAt: Date;
}
