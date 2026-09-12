import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { AnalyzeJobDescriptionDto } from '../dto/analyze-job-description.dto.js';
import { JobDescriptionAnalysisService } from '../services/job-description-analysis.service.js';

@ApiTags('Job Description Analysis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('job-description-analysis')
export class JobDescriptionAnalysisController {
  constructor(
    private readonly analysisService: JobDescriptionAnalysisService,
  ) {}

  @Post()
  @ApiMessage('Job description analyzed successfully')
  analyze(@Body() dto: AnalyzeJobDescriptionDto) {
    return this.analysisService.analyze(dto);
  }
}
