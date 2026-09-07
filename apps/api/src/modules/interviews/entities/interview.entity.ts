import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';

@Entity('opportunity_interviews')
@Index(['opportunityId', 'scheduledAt'])
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  opportunityId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Opportunity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'opportunityId' })
  opportunity: Opportunity;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'datetime' })
  scheduledAt: Date;

  @Column({ type: 'int', nullable: true })
  durationMinutes: number | null;

  @Column({ type: 'text', nullable: true })
  interviewers: string | null;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  meetingLocation: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  stage: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'tinyint', nullable: true })
  performanceRating: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
