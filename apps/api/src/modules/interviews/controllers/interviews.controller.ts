import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CreateInterviewDto } from '../dto/create-interview.dto.js';
import { UpdateInterviewDto } from '../dto/update-interview.dto.js';
import { InterviewsService } from '../services/interviews.service.js';

@ApiTags('Opportunity Interviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities/:opportunityId/interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get()
  @ApiMessage('Opportunity interviews retrieved successfully')
  findAll(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.interviewsService.findAllForOpportunity(user.id, opportunityId);
  }

  @Post()
  @ApiMessage('Interview created successfully')
  create(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Body() dto: CreateInterviewDto,
  ) {
    return this.interviewsService.create(user.id, opportunityId, dto);
  }

  @Patch(':interviewId')
  @ApiMessage('Interview updated successfully')
  update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('interviewId') interviewId: string,
    @Body() dto: UpdateInterviewDto,
  ) {
    return this.interviewsService.update(
      user.id,
      opportunityId,
      interviewId,
      dto,
    );
  }

  @Delete(':interviewId')
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Interview deleted successfully')
  remove(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('interviewId') interviewId: string,
  ) {
    return this.interviewsService.remove(user.id, opportunityId, interviewId);
  }
}
