import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CreateInterviewMemoryDto } from '../dto/create-interview-memory.dto.js';
import { AiIntelligenceService } from '../services/ai-intelligence.service.js';

@ApiTags('AI Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities/:opportunityId/ai')
export class AiIntelligenceController {
  constructor(private readonly aiService: AiIntelligenceService) {}

  @Post('fit-score')
  @ApiMessage('Opportunity fit score generated successfully')
  score(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.aiService.scoreOpportunity(user.id, opportunityId);
  }

  @Get('fit-score')
  @ApiMessage('Opportunity fit score retrieved successfully')
  latestScore(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.aiService.latestFitScore(user.id, opportunityId);
  }

  @Post('interview-preparation')
  @ApiMessage('Interview preparation generated successfully')
  prepare(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.aiService.prepareInterview(user.id, opportunityId);
  }

  @Get('interview-preparation')
  @ApiMessage('Interview preparation retrieved successfully')
  latestPreparation(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.aiService.latestPreparation(user.id, opportunityId);
  }

  @Post('interviews/:interviewId/memory')
  @ApiMessage('Interview memory extracted successfully')
  remember(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('interviewId') interviewId: string,
    @Body() dto: CreateInterviewMemoryDto,
  ) {
    return this.aiService.rememberInterview(
      user.id,
      opportunityId,
      interviewId,
      dto,
    );
  }

  @Get('interviews/:interviewId/memory')
  @ApiMessage('Interview memory retrieved successfully')
  latestMemory(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('interviewId') interviewId: string,
  ) {
    return this.aiService.latestMemory(user.id, opportunityId, interviewId);
  }
}
