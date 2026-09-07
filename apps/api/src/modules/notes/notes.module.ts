import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunitiesModule } from '../opportunities/opportunities.module.js';
import { NotesController } from './controllers/notes.controller.js';
import { Note } from './entities/note.entity.js';
import { NoteAttachment } from './entities/note-attachment.entity.js';
import { NotesRepository } from './repositories/notes.repository.js';
import { NotesService } from './services/notes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Note, NoteAttachment]), OpportunitiesModule],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
})
export class NotesModule {}
