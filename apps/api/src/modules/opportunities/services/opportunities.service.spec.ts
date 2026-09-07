import { mock } from 'vitest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service.js';
import { OpportunitiesRepository } from '../repositories/opportunities.repository.js';
import { ActivitiesRepository } from '../repositories/activities.repository.js';
import { Opportunity } from '../entities/opportunity.entity.js';

describe('OpportunitiesService', () => {
  let service: OpportunitiesService;
  let repository: Mocked<OpportunitiesRepository>;
  let activitiesRepository: Mocked<ActivitiesRepository>;

  const mockUserId = 'user-123';
  const mockOpportunityId = 'opp-456';

  beforeEach(() => {
    repository = mock<OpportunitiesRepository>();
    activitiesRepository = mock<ActivitiesRepository>();
    service = new OpportunitiesService(repository, activitiesRepository);
  });

  describe('create', () => {
    it('should create and return an opportunity', async () => {
      const createDto = {
        companyName: 'Acme Corp',
        jobTitle: 'Software Engineer',
      };
      const expectedOpp = {
        id: mockOpportunityId,
        ...createDto,
        userId: mockUserId,
      } as Opportunity;

      repository.create.mockResolvedValueOnce(expectedOpp);
      activitiesRepository.create.mockResolvedValueOnce({} as never);

      const result = await service.create(mockUserId, createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        userId: mockUserId,
      });
      expect(result).toEqual(expectedOpp);
    });
  });

  describe('findOne', () => {
    it('should return an opportunity if it exists and belongs to the user', async () => {
      const expectedOpp = {
        id: mockOpportunityId,
        userId: mockUserId,
      } as Opportunity;
      repository.findOne.mockResolvedValueOnce(expectedOpp);

      const result = await service.findOne(mockOpportunityId, mockUserId);

      expect(repository.findOne).toHaveBeenCalledWith(
        mockOpportunityId,
        mockUserId,
      );
      expect(result).toEqual(expectedOpp);
    });

    it('should throw NotFoundException if opportunity is not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.findOne(mockOpportunityId, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllForUser', () => {
    it('passes advanced filters to the repository', async () => {
      const opportunities = [{ id: mockOpportunityId }] as Opportunity[];
      const filters = {
        q: 'backend',
        stage: 'interview' as const,
        salaryMin: 100000,
      };
      repository.findAllForUser.mockResolvedValueOnce(opportunities);

      await expect(
        service.findAllForUser(mockUserId, filters),
      ).resolves.toEqual(opportunities);
      expect(repository.findAllForUser).toHaveBeenCalledWith(
        mockUserId,
        filters,
      );
    });
  });

  describe('update', () => {
    it('should verify existence and update the opportunity', async () => {
      const existingOpp = {
        id: mockOpportunityId,
        userId: mockUserId,
      } as Opportunity;
      const expectedResult = { affected: 1, raw: [], generatedMaps: [] };

      repository.findOne.mockResolvedValueOnce(existingOpp);
      repository.update.mockResolvedValueOnce(expectedResult as any);
      activitiesRepository.create.mockResolvedValueOnce({} as never);

      const result = await service.update(mockOpportunityId, mockUserId, {
        companyName: 'New Name',
      });

      expect(repository.update).toHaveBeenCalledWith(
        mockOpportunityId,
        mockUserId,
        {
          companyName: 'New Name',
        },
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('changeStage', () => {
    it('should update the stage', async () => {
      const existingOpp = {
        id: mockOpportunityId,
        userId: mockUserId,
        stage: 'discovered',
      } as Opportunity;
      const expectedResult = { affected: 1, raw: [], generatedMaps: [] };

      repository.findOne.mockResolvedValueOnce(existingOpp);
      repository.update.mockResolvedValueOnce(expectedResult as any);

      const result = await service.changeStage(
        mockOpportunityId,
        mockUserId,
        'applied',
      );

      expect(repository.update).toHaveBeenCalledWith(
        mockOpportunityId,
        mockUserId,
        { stage: 'applied' },
      );
      expect(activitiesRepository.create).toHaveBeenCalledWith(
        mockUserId,
        mockOpportunityId,
        expect.objectContaining({ type: 'status_change' }),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should verify existence and delete the opportunity', async () => {
      const existingOpp = {
        id: mockOpportunityId,
        userId: mockUserId,
      } as Opportunity;

      repository.findOne.mockResolvedValueOnce(existingOpp);
      repository.delete.mockResolvedValueOnce(true);

      await service.remove(mockOpportunityId, mockUserId);

      expect(repository.delete).toHaveBeenCalledWith(
        mockOpportunityId,
        mockUserId,
      );
    });
  });
});
