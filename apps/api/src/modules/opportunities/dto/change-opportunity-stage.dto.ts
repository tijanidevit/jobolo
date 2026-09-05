import { IsEnum } from 'class-validator';
import { OPPORTUNITY_STATUSES } from '../constants.js';
import type { OpportunityStatus } from '@jobolo/shared';

export class ChangeOpportunityStageDto {
  @IsEnum(OPPORTUNITY_STATUSES)
  stage: OpportunityStatus;
}
