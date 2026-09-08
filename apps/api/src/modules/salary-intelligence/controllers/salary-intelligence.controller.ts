import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { SalaryIntelligenceService } from '../services/salary-intelligence.service.js';

@ApiTags('Salary Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('salary-intelligence')
export class SalaryIntelligenceController {
  constructor(
    private readonly salaryIntelligenceService: SalaryIntelligenceService,
  ) {}

  @Get()
  @ApiMessage('Salary intelligence retrieved successfully')
  getSalaryIntelligence(@CurrentUser() user: IAuthenticatedUser) {
    return this.salaryIntelligenceService.getSalaryIntelligence(user.id);
  }
}
