import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import type { ActivityType } from '@jobolo/shared';
import { User } from '../../users/entities/user.entity.js';
import { Opportunity } from './opportunity.entity.js';
import { ActivityAttachment } from './activity-attachment.entity.js';

@Entity('opportunity_activities')
@Index(['opportunityId', 'occurredAt'])
export class Activity {
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
  type: ActivityType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'datetime' })
  occurredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ActivityAttachment, (attachment) => attachment.activity, { cascade: true })
  attachments: ActivityAttachment[];
}
