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
import { CreateTaskDto } from '../dto/create-task.dto.js';
import { UpdateTaskDto } from '../dto/update-task.dto.js';
import { TasksService } from '../services/tasks.service.js';

@ApiTags('Opportunity Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities/:opportunityId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiMessage('Opportunity tasks retrieved successfully')
  findAll(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.tasksService.findAllForOpportunity(user.id, opportunityId);
  }

  @Post()
  @ApiMessage('Task created successfully')
  create(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(user.id, opportunityId, dto);
  }

  @Patch(':taskId')
  @ApiMessage('Task updated successfully')
  update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, opportunityId, taskId, dto);
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Task deleted successfully')
  remove(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.remove(user.id, opportunityId, taskId);
  }
}
