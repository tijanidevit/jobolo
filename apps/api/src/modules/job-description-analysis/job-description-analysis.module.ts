import { Module } from '@nestjs/common';
import { JobDescriptionAnalysisController } from './controllers/job-description-analysis.controller.js';
import { JobDescriptionAnalysisService } from './services/job-description-analysis.service.js';

@Module({
  controllers: [JobDescriptionAnalysisController],
  providers: [JobDescriptionAnalysisService],
})
export class JobDescriptionAnalysisModule {}
