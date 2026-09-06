import { IsDate, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ACTIVITY_TYPES } from '@jobolo/shared';
import type { ActivityType } from '@jobolo/shared';

export class CreateActivityDto {
  @IsEnum(ACTIVITY_TYPES)
  type: ActivityType;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsDate()
  @Type(() => Date)
  occurredAt: Date;
}
