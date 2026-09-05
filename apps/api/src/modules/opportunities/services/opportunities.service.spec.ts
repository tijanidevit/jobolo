import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service.js';
import { OpportunitiesRepository } from '../repositories/opportunities.repository.js';
import { Opportunity } from '../entities/opportunity.entity.js';

describe('OpportunitiesService', () => {
  let service: OpportunitiesService;
  let repository: Mocked<OpportunitiesRepository>;

  const mockUserId = 'user-123';
  const mockOpportunityId = 'opp-456';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunitiesService,
        {
          provide: OpportunitiesRepository,
          useValue: mock<OpportunitiesRepository>(),
        },
      ],
    }).compile();

    service = module.get<OpportunitiesService>(OpportunitiesService);
    repository = module.get(OpportunitiesRepository);
  });

  describe('create', () => {
    it('should create and return an opportunity', async () => {
      const createDto = {
        companyName: 'Acme Corp',
        jobTitle: 'Software Engineer',
      };
      const expectedOpp = { id: mockOpportunityId, ...createDto, userId: mockUserId } as Opportunity;

      repository.create.mockResolvedValueOnce(expectedOpp);

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
      const expectedOpp = { id: mockOpportunityId, userId: mockUserId } as Opportunity;
      repository.findOne.mockResolvedValueOnce(expectedOpp);

      const result = await service.findOne(mockOpportunityId, mockUserId);

      expect(repository.findOne).toHaveBeenCalledWith(mockOpportunityId, mockUserId);
      expect(result).toEqual(expectedOpp);
    });

    it('should throw NotFoundException if opportunity is not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(mockOpportunityId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should verify existence and update the opportunity', async () => {
      const existingOpp = { id: mockOpportunityId, userId: mockUserId } as Opportunity;
      const expectedResult = { affected: 1, raw: [], generatedMaps: [] };

      repository.findOne.mockResolvedValueOnce(existingOpp);
      repository.update.mockResolvedValueOnce(expectedResult as any);

      const result = await service.update(mockOpportunityId, mockUserId, { companyName: 'New Name' });

      expect(repository.update).toHaveBeenCalledWith(mockOpportunityId, mockUserId, {
        companyName: 'New Name',
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('changeStage', () => {
    it('should update the stage', async () => {
      const existingOpp = { id: mockOpportunityId, userId: mockUserId, stage: 'discovered' } as Opportunity;
      const expectedResult = { affected: 1, raw: [], generatedMaps: [] };

      repository.findOne.mockResolvedValueOnce(existingOpp);
      repository.update.mockResolvedValueOnce(expectedResult as any);

      const result = await service.changeStage(mockOpportunityId, mockUserId, 'applied');

      expect(repository.update).toHaveBeenCalledWith(mockOpportunityId, mockUserId, { stage: 'applied' });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should verify existence and delete the opportunity', async () => {
      const existingOpp = { id: mockOpportunityId, userId: mockUserId } as Opportunity;

      repository.findOne.mockResolvedValueOnce(existingOpp);
      repository.delete.mockResolvedValueOnce(true);

      await service.remove(mockOpportunityId, mockUserId);

      expect(repository.delete).toHaveBeenCalledWith(mockOpportunityId, mockUserId);
    });
  });
});
