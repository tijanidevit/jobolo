import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ActivitiesService } from './activities.service.js';
import { ActivitiesRepository } from '../repositories/activities.repository.js';
import { OpportunitiesRepository } from '../repositories/opportunities.repository.js';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let activitiesRepository: Mocked<ActivitiesRepository>;
  let opportunitiesRepository: Mocked<OpportunitiesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        { provide: ActivitiesRepository, useValue: mock<ActivitiesRepository>() },
        { provide: OpportunitiesRepository, useValue: mock<OpportunitiesRepository>() },
      ],
    }).compile();

    service = module.get(ActivitiesService);
    activitiesRepository = module.get(ActivitiesRepository);
    opportunitiesRepository = module.get(OpportunitiesRepository);
  });

  it('creates an activity for an opportunity owned by the user', async () => {
    const dto = {
      type: 'email' as const,
      title: 'Recruiter followed up',
      occurredAt: new Date('2026-09-06T10:00:00.000Z'),
    };
    const activity = { id: 'activity-1', opportunityId: 'opportunity-1', ...dto };
    opportunitiesRepository.findOne.mockResolvedValueOnce({ id: 'opportunity-1' } as never);
    activitiesRepository.create.mockResolvedValueOnce(activity as never);

    await expect(service.create('user-1', 'opportunity-1', dto)).resolves.toEqual(activity);
    expect(activitiesRepository.create).toHaveBeenCalledWith('user-1', 'opportunity-1', dto);
  });

  it('rejects activity access when the opportunity belongs to another user', async () => {
    opportunitiesRepository.findOne.mockResolvedValueOnce(null);

    await expect(service.findAllForOpportunity('user-1', 'opportunity-1')).rejects.toThrow(NotFoundException);
    expect(activitiesRepository.findAllForOpportunity).not.toHaveBeenCalled();
  });
});
