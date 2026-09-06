import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from '../../opportunities/repositories/opportunities.repository.js';
import type { CreateNoteDto } from '../dto/create-note.dto.js';
import type { UpdateNoteDto } from '../dto/update-note.dto.js';
import { NotesRepository } from '../repositories/notes.repository.js';

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
    private readonly opportunitiesRepository: OpportunitiesRepository,
  ) {}

  async findAllForOpportunity(userId: string, opportunityId: string) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.notesRepository.findAllForOpportunity(userId, opportunityId);
  }

  async create(userId: string, opportunityId: string, dto: CreateNoteDto) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.notesRepository.create(userId, opportunityId, dto);
  }

  async update(
    userId: string,
    opportunityId: string,
    noteId: string,
    dto: UpdateNoteDto,
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const note = await this.notesRepository.update(
      noteId,
      userId,
      opportunityId,
      dto,
    );
    if (!note) throw new NotFoundException('Note not found');
    return note;
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
}
