import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OpportunitiesService } from '../services/opportunities.service.js';
import { CreateOpportunityDto } from '../dto/create-opportunity.dto.js';
import { UpdateOpportunityDto } from '../dto/update-opportunity.dto.js';
import { ChangeOpportunityStageDto } from '../dto/change-opportunity-stage.dto.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { OpportunityQueryDto } from '../dto/opportunity-query.dto.js';

@ApiTags('Opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  @ApiMessage('Opportunity created successfully')
  async create(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() createOpportunityDto: CreateOpportunityDto,
  ) {
    return this.opportunitiesService.create(user.id, createOpportunityDto);
  }

  @Get()
  @ApiMessage('Opportunities retrieved successfully')
  async findAll(
    @CurrentUser() user: IAuthenticatedUser,
    @Query() query?: OpportunityQueryDto,
  ) {
    return query
      ? this.opportunitiesService.findAllForUser(user.id, query)
      : this.opportunitiesService.findAllForUser(user.id);
  }

  @Get(':id')
  @ApiMessage('Opportunity retrieved successfully')
  async findOne(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.opportunitiesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiMessage('Opportunity updated successfully')
  async update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
    @Body() updateOpportunityDto: UpdateOpportunityDto,
  ) {
    return this.opportunitiesService.update(id, user.id, updateOpportunityDto);
  }

  @Patch(':id/stage')
  @ApiMessage('Opportunity stage updated successfully')
  async changeStage(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
    @Body() changeStageDto: ChangeOpportunityStageDto,
  ) {
    return this.opportunitiesService.changeStage(
      id,
      user.id,
      changeStageDto.stage,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Opportunity deleted successfully')
  async remove(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.opportunitiesService.remove(id, user.id);
  }
}
