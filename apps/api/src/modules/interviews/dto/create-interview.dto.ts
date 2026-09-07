import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInterviewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  type: string;

  @IsDate()
  @Type(() => Date)
  scheduledAt: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  interviewers?: string;

  @IsOptional()
  @MaxLength(2048)
  meetingLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  stage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  performanceRating?: number;
}
