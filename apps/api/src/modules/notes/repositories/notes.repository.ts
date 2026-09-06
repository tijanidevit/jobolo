import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity.js';
import type { CreateNoteDto } from '../dto/create-note.dto.js';
import type { UpdateNoteDto } from '../dto/update-note.dto.js';

@Injectable()
export class NotesRepository {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>,
  ) {}

  async findAllForOpportunity(userId: string, opportunityId: string) {
    return this.repository.find({
      where: { userId, opportunityId },
      order: { updatedAt: 'DESC', createdAt: 'DESC' },
    });
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

  async update(
    id: string,
    userId: string,
    opportunityId: string,
    data: UpdateNoteDto,
  ) {
    const updateData = data.content === undefined ? {} : { content: data.content.trim() };
    await this.repository.update({ id, userId, opportunityId }, updateData);
    return this.repository.findOne({ where: { id, userId, opportunityId } });
  }

  async delete(id: string, userId: string, opportunityId: string) {
    const result = await this.repository.delete({ id, userId, opportunityId });
    return (result.affected ?? 0) > 0;
  }
}
