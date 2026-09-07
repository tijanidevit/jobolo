import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from '../../opportunities/repositories/opportunities.repository.js';
import type { CreateNoteDto } from '../dto/create-note.dto.js';
import type { UpdateNoteDto } from '../dto/update-note.dto.js';
import { NotesRepository } from '../repositories/notes.repository.js';
import type { PaginatedResponse } from '@jobolo/shared';
import { MAX_PAGE_SIZE } from '../../../common/dto/pagination-query.dto.js';
import type { Note } from '../entities/note.entity.js';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { extname, join } from 'node:path';

export interface UploadedNoteFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
    private readonly opportunitiesRepository: OpportunitiesRepository,
  ) {}

  async findAllForOpportunity(
    userId: string,
    opportunityId: string,
    page = 1,
    limit = MAX_PAGE_SIZE,
  ): Promise<PaginatedResponse<Note>> {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.notesRepository.findAllForOpportunity(
      userId,
      opportunityId,
      page,
      limit,
    );
  }

  async create(
    userId: string,
    opportunityId: string,
    dto: CreateNoteDto,
    files: UploadedNoteFile[] = [],
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const note = await this.notesRepository.create(userId, opportunityId, dto);
    await this.storeAttachments(note.id, files);
    return this.notesRepository.findOne(note.id, userId, opportunityId);
  }

  async update(
    userId: string,
    opportunityId: string,
    noteId: string,
    dto: UpdateNoteDto,
    files: UploadedNoteFile[] = [],
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const note = await this.notesRepository.update(
      noteId,
      userId,
      opportunityId,
      dto,
    );
    if (!note) throw new NotFoundException('Note not found');
    await this.storeAttachments(note.id, files);
    return this.notesRepository.findOne(note.id, userId, opportunityId);
  }

  async remove(userId: string, opportunityId: string, noteId: string) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const removed = await this.notesRepository.delete(
      noteId,
      userId,
      opportunityId,
    );
    if (!removed) throw new NotFoundException('Note not found');
  }

  async getAttachment(
    userId: string,
    opportunityId: string,
    noteId: string,
    storedName: string,
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const note = await this.notesRepository.findOne(userId, opportunityId, noteId);
    const attachment = note?.attachments.find((item) => item.storedName === storedName);
    if (!attachment) throw new NotFoundException('Attachment not found');

    return {
      path: join(process.cwd(), 'uploads', 'notes', attachment.storedName),
      mimeType: attachment.mimeType,
    };
  }

  private async ensureOpportunityBelongsToUser(
    userId: string,
    opportunityId: string,
  ) {
    const opportunity = await this.opportunitiesRepository.findOne(
      opportunityId,
      userId,
    );
    if (!opportunity) throw new NotFoundException('Opportunity not found');
  }

  private async storeAttachments(noteId: string, files: UploadedNoteFile[]) {
    if (files.length === 0) return;

    const attachmentData = await Promise.all(
      files.map(async (file) => {
        const storedName = `${Date.now()}-${randomUUID()}${extname(file.originalname)}`;
        await fs.mkdir(join(process.cwd(), 'uploads', 'notes'), { recursive: true });
        await fs.writeFile(join(process.cwd(), 'uploads', 'notes', storedName), file.buffer);
        return {
          originalName: file.originalname,
          storedName,
          mimeType: file.mimetype,
          size: file.size,
        };
      }),
    );

    await this.notesRepository.addAttachments(noteId, attachmentData);
  }
}
