import { Test, TestingModule } from '@nestjs/testing';
import { OpportunitiesController } from './opportunities.controller.js';
import { OpportunitiesService } from '../services/opportunities.service.js';
import { CreateOpportunityDto } from '../dto/create-opportunity.dto.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { PassportModule } from '@nestjs/passport';

describe('OpportunitiesController', () => {
  let controller: OpportunitiesController;
  let service: Mocked<OpportunitiesService>;

  const mockUser: IAuthenticatedUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockOpportunity = {
    id: 'opp-456',
    userId: 'user-123',
    companyName: 'Acme Corp',
    jobTitle: 'Developer',
    stage: 'discovered',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [OpportunitiesController],
      providers: [
        {
          provide: OpportunitiesService,
          useValue: mock<OpportunitiesService>(),
        },
      ],
    }).compile();

    controller = module.get<OpportunitiesController>(OpportunitiesController);
    service = module.get(OpportunitiesService);
  });

  it('should create an opportunity and pass the correct userId', async () => {
    const dto: CreateOpportunityDto = { companyName: 'Acme Corp', jobTitle: 'Developer' };
    service.create.mockResolvedValueOnce(mockOpportunity as any);

    const result = await controller.create(mockUser, dto);

    expect(service.create).toHaveBeenCalledWith(mockUser.id, dto);
    expect(result).toEqual(mockOpportunity);
  });

  it('should find all opportunities for the current user', async () => {
    service.findAllForUser.mockResolvedValueOnce([mockOpportunity as any]);

    const result = await controller.findAll(mockUser);

    expect(service.findAllForUser).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual([mockOpportunity]);
  });

  it('should find one opportunity and ensure ownership isolation', async () => {
    service.findOne.mockResolvedValueOnce(mockOpportunity as any);

    const result = await controller.findOne(mockUser, 'opp-456');

    // This proves the controller enforces isolation by ALWAYS passing the authenticated user's ID
    expect(service.findOne).toHaveBeenCalledWith('opp-456', mockUser.id);
    expect(result).toEqual(mockOpportunity);
  });

  it('should update an opportunity ensuring ownership', async () => {
    const expectedResult = { affected: 1, raw: [], generatedMaps: [] };
    service.update.mockResolvedValueOnce(expectedResult as any);

    const result = await controller.update(mockUser, 'opp-456', { companyName: 'New Corp' });

    expect(service.update).toHaveBeenCalledWith('opp-456', mockUser.id, { companyName: 'New Corp' });
    expect(result).toEqual(expectedResult);
  });

  it('should change stage ensuring ownership', async () => {
    const expectedResult = { affected: 1, raw: [], generatedMaps: [] };
    service.changeStage.mockResolvedValueOnce(expectedResult as any);

    const result = await controller.changeStage(mockUser, 'opp-456', { stage: 'applied' });

    expect(service.changeStage).toHaveBeenCalledWith('opp-456', mockUser.id, 'applied');
    expect(result).toEqual(expectedResult);
  });

  it('should remove an opportunity ensuring ownership', async () => {
    service.remove.mockResolvedValueOnce(undefined);

    await controller.remove(mockUser, 'opp-456');

    expect(service.remove).toHaveBeenCalledWith('opp-456', mockUser.id);
  });
});
