import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity.js';
import type { CreateContactDto } from '../dto/create-contact.dto.js';
import type { UpdateContactDto } from '../dto/update-contact.dto.js';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly repository: Repository<Contact>,
  ) {}

  findAllForOpportunity(userId: string, opportunityId: string) {
    return this.repository.find({
      where: { userId, opportunityId },
      order: { name: 'ASC', createdAt: 'ASC' },
    });
  }

  create(userId: string, opportunityId: string, data: CreateContactDto) {
    return this.repository.save(
      this.repository.create({
        userId,
        opportunityId,
        ...data,
        jobTitle: data.jobTitle?.trim() || null,
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        linkedin: data.linkedin?.trim() || null,
        relationship: data.relationship?.trim() || null,
        notes: data.notes?.trim() || null,
      }),
    );
  }

  async update(
    id: string,
    userId: string,
    opportunityId: string,
    data: UpdateContactDto,
  ) {
    await this.repository.update(
      { id, userId, opportunityId },
      {
        ...data,
        ...(data.name !== undefined ? { name: data.name.trim() } : {}),
        ...(data.jobTitle !== undefined
          ? { jobTitle: data.jobTitle.trim() || null }
          : {}),
        ...(data.email !== undefined
          ? { email: data.email.trim() || null }
          : {}),
        ...(data.phone !== undefined
          ? { phone: data.phone.trim() || null }
          : {}),
        ...(data.linkedin !== undefined
          ? { linkedin: data.linkedin.trim() || null }
          : {}),
        ...(data.relationship !== undefined
          ? { relationship: data.relationship.trim() || null }
          : {}),
        ...(data.notes !== undefined
          ? { notes: data.notes.trim() || null }
          : {}),
      },
    );
    return this.findOne(id, userId, opportunityId);
  }

  findOne(id: string, userId: string, opportunityId: string) {
    return this.repository.findOne({ where: { id, userId, opportunityId } });
  }

  async delete(id: string, userId: string, opportunityId: string) {
    const result = await this.repository.delete({ id, userId, opportunityId });
    return (result.affected ?? 0) > 0;
  }
}
