import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Activity } from './activity.entity.js';

@Entity('opportunity_activity_attachments')
export class ActivityAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  activityId: string;

  @ManyToOne('Activity', (activity: Activity) => activity.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  storedName: string;

  @Column({ type: 'varchar', length: 255 })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @CreateDateColumn()
  createdAt: Date;
}
