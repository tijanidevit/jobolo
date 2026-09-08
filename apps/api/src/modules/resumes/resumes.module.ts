import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumesController } from './controllers/resumes.controller.js';
import { Resume } from './entities/resume.entity.js';
import { ResumesService } from './services/resumes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Resume])],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
