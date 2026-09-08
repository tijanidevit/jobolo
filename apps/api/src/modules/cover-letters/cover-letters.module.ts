import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoverLettersController } from './controllers/cover-letters.controller.js';
import { CoverLetter } from './entities/cover-letter.entity.js';
import { CoverLettersService } from './services/cover-letters.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([CoverLetter])],
  controllers: [CoverLettersController],
  providers: [CoverLettersService],
  exports: [CoverLettersService],
})
export class CoverLettersModule {}
