import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Resume } from '../../resumes/entities/resume.entity.js';
import { CoverLetter } from '../../cover-letters/entities/cover-letter.entity.js';
import type {
  OpportunityStatus,
  OpportunityPriority,
  EmploymentType,
  WorkArrangement,
  PayFrequency,
} from '@jobolo/shared';

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // --- Company Information ---
  @Column({ type: 'varchar', length: 255 })
  companyName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  companyWebsite: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  companyCountry: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  companyIndustry: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  companySize: string | null;

  // --- Role Information ---
  @Column({ type: 'varchar', length: 255 })
  jobTitle: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string | null;

  @Column({ type: 'text', nullable: true })
  jobDescription: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  jobUrl: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  employmentType: EmploymentType | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  workArrangement: WorkArrangement | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  // --- Application Status ---
  @Column({ type: 'varchar', length: 50, default: 'discovered' })
  stage: OpportunityStatus;

  // --- Application Dates ---
  @Column({ type: 'datetime', nullable: true })
  dateDiscovered: Date | null;

  @Column({ type: 'datetime', nullable: true })
  dateApplied: Date | null;

  // --- Sourcing ---
  @Column({ type: 'varchar', length: 255, nullable: true })
  source: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referral: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true })
  resumeId: string | null;

  @ManyToOne(() => Resume, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resumeId' })
  resume: Resume | null;

  @Column({ type: 'varchar', length: 36, nullable: true })
  coverLetterId: string | null;

  @ManyToOne(() => CoverLetter, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'coverLetterId' })
  coverLetter: CoverLetter | null;

  // --- Compensation ---
  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  salaryRangeMin: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  salaryRangeMax: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payFrequency: PayFrequency | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  minimumAcceptableSalary: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  targetSalary: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  maximumExpectedSalary: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  equity: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bonus: string | null;

  @Column({ type: 'text', nullable: true })
  benefits: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  contractRate: number | null;

  // --- Personal Assessment ---
  @Column({ type: 'int', nullable: true })
  fitScore: number | null; // 0-100

  @Column({ type: 'int', nullable: true })
  interestScore: number | null; // 0-100

  @Column({ type: 'int', nullable: true })
  confidenceScore: number | null; // 0-100

  @Column({ type: 'varchar', length: 20, nullable: true })
  priority: OpportunityPriority | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  nextAction: string | null;

  @Column({ type: 'datetime', nullable: true })
  nextActionDueDate: Date | null;

  @Column({ type: 'varchar', length: 36, nullable: true })
  nextActionTaskId: string | null;

  // --- Metadata ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
