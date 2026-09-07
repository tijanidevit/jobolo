import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type {
  EmploymentType,
  OpportunityPriority,
  OpportunityStatus,
  WorkArrangement,
} from '@jobolo/shared';
import { OPPORTUNITY_STATUSES } from '../constants.js';

export class OpportunityQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  q?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyCountry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  source?: string;

  @IsOptional()
  @IsEnum(OPPORTUNITY_STATUSES)
  stage?: OpportunityStatus;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: OpportunityPriority;

  @IsOptional()
  @IsEnum(['remote', 'hybrid', 'onsite'])
  workArrangement?: WorkArrangement;

  @IsOptional()
  @IsEnum(['full_time', 'part_time', 'contract', 'freelance', 'internship'])
  employmentType?: EmploymentType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(999999999)
  salaryMax?: number;
}
