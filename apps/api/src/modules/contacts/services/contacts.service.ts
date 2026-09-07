import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from '../../opportunities/repositories/opportunities.repository.js';
import type { CreateContactDto } from '../dto/create-contact.dto.js';
import type { UpdateContactDto } from '../dto/update-contact.dto.js';
import { ContactsRepository } from '../repositories/contacts.repository.js';

@Injectable()
export class ContactsService {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly opportunitiesRepository: OpportunitiesRepository,
  ) {}

  async findAllForOpportunity(userId: string, opportunityId: string) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.contactsRepository.findAllForOpportunity(userId, opportunityId);
  }

  async create(userId: string, opportunityId: string, dto: CreateContactDto) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    return this.contactsRepository.create(userId, opportunityId, dto);
  }

  async update(
    userId: string,
    opportunityId: string,
    contactId: string,
    dto: UpdateContactDto,
  ) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const contact = await this.contactsRepository.update(
      contactId,
      userId,
      opportunityId,
      dto,
    );
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async remove(userId: string, opportunityId: string, contactId: string) {
    await this.ensureOpportunityBelongsToUser(userId, opportunityId);
    const removed = await this.contactsRepository.delete(contactId, userId, opportunityId);
    if (!removed) throw new NotFoundException('Contact not found');
  }

  private async ensureOpportunityBelongsToUser(userId: string, opportunityId: string) {
    const opportunity = await this.opportunitiesRepository.findOne(opportunityId, userId);
    if (!opportunity) throw new NotFoundException('Opportunity not found');
  }
}
