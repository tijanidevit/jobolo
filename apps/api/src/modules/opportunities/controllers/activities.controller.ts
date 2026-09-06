import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { mkdirSync } from 'node:fs';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { CreateActivityDto } from '../dto/create-activity.dto.js';
import {
  ActivitiesService,
  type UploadedActivityFile,
} from '../services/activities.service.js';
import { UpdateActivityDto } from '../dto/update-activity.dto.js';

const uploadDirectory = 'uploads/activities';
mkdirSync(uploadDirectory, { recursive: true });

@ApiTags('Opportunity Timeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities/:opportunityId/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiMessage('Opportunity timeline retrieved successfully')
  async findAll(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.activitiesService.findAllForOpportunity(user.id, opportunityId);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiMessage('Timeline activity created successfully')
  async create(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Body() dto: CreateActivityDto,
    @UploadedFiles() files: UploadedActivityFile[],
  ) {
    return this.activitiesService.create(
      user.id,
      opportunityId,
      dto,
      files ?? [],
    );
  }

  @Patch(':activityId')
  @ApiMessage('Timeline activity updated successfully')
  async update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('activityId') activityId: string,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(
      user.id,
      opportunityId,
      activityId,
      dto,
    );
  }

  @Get(':activityId/attachments/:storedName')
  async getAttachment(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('activityId') activityId: string,
    @Param('storedName') storedName: string,
    @Res() response: Response,
  ) {
    const attachment = await this.activitiesService.getAttachment(
      user.id,
      opportunityId,
      activityId,
      storedName,
    );
    return response.type(attachment.mimeType).sendFile(attachment.path);
  }
}
