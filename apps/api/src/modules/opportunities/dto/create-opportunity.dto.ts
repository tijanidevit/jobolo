import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  IsUrl,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OPPORTUNITY_STATUSES } from '@jobolo/shared';
import type {
  OpportunityStatus,
  OpportunityPriority,
  EmploymentType,
  WorkArrangement,
  PayFrequency,
} from '@jobolo/shared';

export class CreateOpportunityDto {
  // --- Company Information ---
  @IsString()
  @MaxLength(255)
  companyName: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  companyWebsite?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyCountry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyIndustry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  companySize?: string;

  // --- Role Information ---
  @IsString()
  @MaxLength(255)
  jobTitle: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  jobUrl?: string;

  @IsOptional()
  @IsEnum(['full_time', 'part_time', 'contract', 'freelance', 'internship'])
  employmentType?: EmploymentType;

  @IsOptional()
  @IsEnum(['remote', 'hybrid', 'onsite'])
  workArrangement?: WorkArrangement;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  // --- Application Status ---
  @IsOptional()
  @IsEnum(OPPORTUNITY_STATUSES)
  stage?: OpportunityStatus;

  // --- Application Dates ---
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  dateDiscovered?: Date;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  dateApplied?: Date;

  // --- Sourcing ---
  @IsOptional()
  @IsString()
  @MaxLength(255)
  source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  referral?: string;

  // --- Compensation ---
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsNumber()
  salaryRangeMin?: number;

  @IsOptional()
  @IsNumber()
  salaryRangeMax?: number;

  @IsOptional()
  @IsEnum(['annual', 'monthly', 'weekly', 'daily', 'hourly'])
  payFrequency?: PayFrequency;

  @IsOptional()
  @IsNumber()
  minimumAcceptableSalary?: number;

  @IsOptional()
  @IsNumber()
  targetSalary?: number;

  @IsOptional()
  @IsNumber()
  maximumExpectedSalary?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  equity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bonus?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsNumber()
  contractRate?: number;

  // --- Personal Assessment ---
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  fitScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  interestScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  confidenceScore?: number;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: OpportunityPriority;
}
