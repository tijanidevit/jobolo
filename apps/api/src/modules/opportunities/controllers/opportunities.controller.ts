import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OpportunitiesService } from '../services/opportunities.service.js';
import { CreateOpportunityDto } from '../dto/create-opportunity.dto.js';
import { UpdateOpportunityDto } from '../dto/update-opportunity.dto.js';
import { ChangeOpportunityStageDto } from '../dto/change-opportunity-stage.dto.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';

@ApiTags('Opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new opportunity' })
  async create(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() createOpportunityDto: CreateOpportunityDto,
  ) {
    return this.opportunitiesService.create(user.id, createOpportunityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all opportunities for the current user' })
  async findAll(@CurrentUser() user: IAuthenticatedUser) {
    return this.opportunitiesService.findAllForUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific opportunity' })
  async findOne(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.opportunitiesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an opportunity' })
  async update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
    @Body() updateOpportunityDto: UpdateOpportunityDto,
  ) {
    return this.opportunitiesService.update(id, user.id, updateOpportunityDto);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Change the pipeline stage of an opportunity' })
  async changeStage(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
    @Body() changeStageDto: ChangeOpportunityStageDto,
  ) {
    return this.opportunitiesService.changeStage(id, user.id, changeStageDto.stage);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an opportunity' })
  async remove(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.opportunitiesService.remove(id, user.id);
  }
}
