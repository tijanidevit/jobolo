import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { Repository } from 'typeorm';
import { Resume } from '../entities/resume.entity.js';
import { ResumesService } from './resumes.service.js';

describe('ResumesService', () => {
  it('lists only the authenticated user\'s resumes in update order', async () => {
    const repository = mock<Repository<Resume>>();
    const resumes = [{ id: 'resume-1', userId: 'user-1' }] as Resume[];
    repository.find.mockResolvedValue(resumes);
    const service = new ResumesService(repository);

    await expect(service.findAllForUser('user-1')).resolves.toEqual(resumes);
    expect(repository.find).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      order: { updatedAt: 'DESC' },
    });
  });

  it('rejects updates for a resume owned by another user', async () => {
    const repository = mock<Repository<Resume>>();
    repository.findOne.mockResolvedValue(null);
    const service = new ResumesService(repository);

    await expect(service.update('resume-1', 'user-1', { name: 'Updated resume' })).rejects.toThrow(
      'Resume not found',
    );
  });
});
