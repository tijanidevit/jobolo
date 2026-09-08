import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { Repository } from 'typeorm';
import { CoverLetter } from '../entities/cover-letter.entity.js';
import { CoverLettersService } from './cover-letters.service.js';

describe('CoverLettersService', () => {
  it("lists only the authenticated user's cover letters in update order", async () => {
    const repository = mock<Repository<CoverLetter>>();
    const coverLetters = [
      { id: 'cover-letter-1', userId: 'user-1' },
    ] as CoverLetter[];
    repository.find.mockResolvedValue(coverLetters);
    const service = new CoverLettersService(repository);

    await expect(service.findAllForUser('user-1')).resolves.toEqual(
      coverLetters,
    );
    expect(repository.find).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      order: { updatedAt: 'DESC' },
    });
  });

  it('rejects updates for a cover letter owned by another user', async () => {
    const repository = mock<Repository<CoverLetter>>();
    repository.findOne.mockResolvedValue(null);
    const service = new CoverLettersService(repository);

    await expect(
      service.update('cover-letter-1', 'user-1', { name: 'Updated letter' }),
    ).rejects.toThrow('Cover letter not found');
  });
});
