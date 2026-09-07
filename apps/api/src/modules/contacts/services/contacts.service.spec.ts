import { mock } from 'vitest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { ContactsService } from './contacts.service.js';
import { ContactsRepository } from '../repositories/contacts.repository.js';
import { OpportunitiesRepository } from '../../opportunities/repositories/opportunities.repository.js';

describe('ContactsService', () => {
  let service: ContactsService;
  let contactsRepository: Mocked<ContactsRepository>;
  let opportunitiesRepository: Mocked<OpportunitiesRepository>;

  beforeEach(() => {
    contactsRepository = mock<ContactsRepository>();
    opportunitiesRepository = mock<OpportunitiesRepository>();
    service = new ContactsService(contactsRepository, opportunitiesRepository);
  });

  it('returns all contacts for an owned opportunity', async () => {
    const contacts = [{ id: 'contact-1' }, { id: 'contact-2' }];
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    contactsRepository.findAllForOpportunity.mockResolvedValueOnce(contacts as never);

    await expect(service.findAllForOpportunity('user-1', 'opportunity-1')).resolves.toEqual(
      contacts,
    );
    expect(contactsRepository.findAllForOpportunity).toHaveBeenCalledWith(
      'user-1',
      'opportunity-1',
    );
  });

  it('creates a contact for an owned opportunity', async () => {
    const dto = { name: 'Sarah Johnson', email: 'sarah@example.com' };
    const contact = { id: 'contact-1', ...dto };
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    contactsRepository.create.mockResolvedValueOnce(contact as never);

    await expect(service.create('user-1', 'opportunity-1', dto)).resolves.toEqual(contact);
    expect(contactsRepository.create).toHaveBeenCalledWith('user-1', 'opportunity-1', dto);
  });

  it('updates a contact owned by the user', async () => {
    const updated = { id: 'contact-1', name: 'Updated name' };
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    contactsRepository.update.mockResolvedValueOnce(updated as never);

    await expect(
      service.update('user-1', 'opportunity-1', 'contact-1', { name: 'Updated name' }),
    ).resolves.toEqual(updated);
  });

  it('rejects access when the opportunity belongs to another user', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce(null);

    await expect(service.findAllForOpportunity('user-1', 'opportunity-1')).rejects.toThrow(
      NotFoundException,
    );
    expect(contactsRepository.findAllForOpportunity).not.toHaveBeenCalled();
  });

  it('rejects deleting a contact that does not belong to the opportunity', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    contactsRepository.delete.mockResolvedValueOnce(false);

    await expect(service.remove('user-1', 'opportunity-1', 'contact-1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
