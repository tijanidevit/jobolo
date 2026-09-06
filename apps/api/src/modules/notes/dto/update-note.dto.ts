import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto.js';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
