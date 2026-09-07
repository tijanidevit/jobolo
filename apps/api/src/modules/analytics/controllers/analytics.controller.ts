import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { AnalyticsService } from '../services/analytics.service.js';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiMessage('Analytics overview retrieved successfully')
  overview(@CurrentUser() user: IAuthenticatedUser) {
    return this.analyticsService.getOverview(user.id);
  }

  @Get('career-intelligence')
  @ApiMessage('Career intelligence retrieved successfully')
  careerIntelligence(@CurrentUser() user: IAuthenticatedUser) {
    return this.analyticsService.getCareerIntelligence(user.id);
  }
}
