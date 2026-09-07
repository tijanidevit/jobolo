import { mock } from 'vitest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { NotesService } from './notes.service.js';
import { NotesRepository } from '../repositories/notes.repository.js';
import { OpportunitiesRepository } from '../../opportunities/repositories/opportunities.repository.js';

describe('NotesService', () => {
  let service: NotesService;
  let notesRepository: Mocked<NotesRepository>;
  let opportunitiesRepository: Mocked<OpportunitiesRepository>;

  beforeEach(() => {
    notesRepository = mock<NotesRepository>();
    opportunitiesRepository = mock<OpportunitiesRepository>();
    service = new NotesService(notesRepository, opportunitiesRepository);
  });

  it('creates a note for an opportunity owned by the user', async () => {
    const note = { id: 'note-1', content: 'Remember the team structure.' };
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    notesRepository.create.mockResolvedValueOnce(note as never);

    await expect(
      service.create('user-1', 'opportunity-1', { content: 'Remember the team structure.' }),
    ).resolves.toEqual(note);
    expect(notesRepository.create).toHaveBeenCalledWith(
      'user-1',
      'opportunity-1',
      { content: 'Remember the team structure.' },
    );
  });

  it('rejects note access when the opportunity is not owned by the user', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce(null);

    await expect(service.findAllForOpportunity('user-1', 'opportunity-1')).rejects.toThrow(
      NotFoundException,
    );
    expect(notesRepository.findAllForOpportunity).not.toHaveBeenCalled();
  });

  it('rejects updates for a note that does not belong to the opportunity', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    notesRepository.update.mockResolvedValueOnce(null);

    await expect(
      service.update('user-1', 'opportunity-1', 'note-1', { content: 'Updated' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deletes a note owned by the user', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    notesRepository.delete.mockResolvedValueOnce(true);

    await expect(service.remove('user-1', 'opportunity-1', 'note-1')).resolves.toBeUndefined();
    expect(notesRepository.delete).toHaveBeenCalledWith('note-1', 'user-1', 'opportunity-1');
  });
});
