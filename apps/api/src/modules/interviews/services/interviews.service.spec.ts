import { mock } from 'vitest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { InterviewsService } from './interviews.service.js';
import { InterviewsRepository } from '../repositories/interviews.repository.js';
import { OpportunitiesRepository } from '../../opportunities/repositories/opportunities.repository.js';

describe('InterviewsService', () => {
  let service: InterviewsService;
  let interviewsRepository: Mocked<InterviewsRepository>;
  let opportunitiesRepository: Mocked<OpportunitiesRepository>;

  beforeEach(() => {
    interviewsRepository = mock<InterviewsRepository>();
    opportunitiesRepository = mock<OpportunitiesRepository>();
    service = new InterviewsService(
      interviewsRepository,
      opportunitiesRepository,
    );
  });

  it('returns interviews for an owned opportunity', async () => {
    const interviews = [{ id: 'interview-1' }];
    opportunitiesRepository.findOne.mockResolvedValueOnce({
      id: 'opportunity-1',
    } as never);
    interviewsRepository.findAllForOpportunity.mockResolvedValueOnce(
      interviews as never,
    );

    await expect(
      service.findAllForOpportunity('user-1', 'opportunity-1'),
    ).resolves.toEqual(interviews);
  });

  it('creates an interview for an owned opportunity', async () => {
    const dto = {
      type: 'Technical',
      scheduledAt: new Date('2026-09-10T10:00:00.000Z'),
    };
    const interview = { id: 'interview-1', ...dto };
    opportunitiesRepository.findOne.mockResolvedValueOnce({
      id: 'opportunity-1',
    } as never);
    interviewsRepository.create.mockResolvedValueOnce(interview as never);

    await expect(
      service.create('user-1', 'opportunity-1', dto),
    ).resolves.toEqual(interview);
  });

  it('updates an interview owned by the user', async () => {
    const updated = { id: 'interview-1', type: 'HR' };
    opportunitiesRepository.findOne.mockResolvedValueOnce({
      id: 'opportunity-1',
    } as never);
    interviewsRepository.update.mockResolvedValueOnce(updated as never);

    await expect(
      service.update('user-1', 'opportunity-1', 'interview-1', { type: 'HR' }),
    ).resolves.toEqual(updated);
  });

  it('rejects access when the opportunity belongs to another user', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce(null);

    await expect(
      service.findAllForOpportunity('user-1', 'opportunity-1'),
    ).rejects.toThrow(NotFoundException);
    expect(interviewsRepository.findAllForOpportunity).not.toHaveBeenCalled();
  });

  it('rejects deleting a missing interview', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce({
      id: 'opportunity-1',
    } as never);
    interviewsRepository.delete.mockResolvedValueOnce(false);

    await expect(
      service.remove('user-1', 'opportunity-1', 'interview-1'),
    ).rejects.toThrow(NotFoundException);
  });
});
