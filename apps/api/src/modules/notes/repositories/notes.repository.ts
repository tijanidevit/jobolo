import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity.js';
import type { CreateNoteDto } from '../dto/create-note.dto.js';
import type { UpdateNoteDto } from '../dto/update-note.dto.js';
import type { PaginatedResponse } from '@jobolo/shared';
import { MAX_PAGE_SIZE } from '../../../common/dto/pagination-query.dto.js';
import type { NoteAttachment } from '../entities/note-attachment.entity.js';

@Injectable()
export class NotesRepository {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>,
  ) {}

  async findAllForOpportunity(
    userId: string,
    opportunityId: string,
    page = 1,
    limit = MAX_PAGE_SIZE,
  ): Promise<PaginatedResponse<Note>> {
    const [data, total] = await this.repository.findAndCount({
      where: { userId, opportunityId },
      relations: { attachments: true },
      order: { updatedAt: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(userId: string, opportunityId: string, data: CreateNoteDto) {
    return this.repository.save(
      this.repository.create({
        userId,
        opportunityId,
        content: data.content.trim(),
      }),
    );
  }

  async findOne(id: string, userId: string, opportunityId: string) {
    return this.repository.findOne({
      where: { id, userId, opportunityId },
      relations: { attachments: true },
    });
  }

  async addAttachments(
    id: string,
    attachments: Array<Partial<NoteAttachment>>,
  ) {
    const note = await this.repository.findOneByOrFail({ id });
    note.attachments = [
      ...(note.attachments ?? []),
      ...(attachments.map((attachment) => ({
        ...attachment,
        noteId: id,
      })) as NoteAttachment[]),
    ];
    return this.repository.save(note);
  }

  async update(
    id: string,
    userId: string,
    opportunityId: string,
    data: UpdateNoteDto,
  ) {
    const updateData =
      data.content === undefined ? {} : { content: data.content.trim() };
    await this.repository.update({ id, userId, opportunityId }, updateData);
    return this.findOne(id, userId, opportunityId);
  }

  async delete(id: string, userId: string, opportunityId: string) {
    const result = await this.repository.delete({ id, userId, opportunityId });
    return (result.affected ?? 0) > 0;
  }
}
