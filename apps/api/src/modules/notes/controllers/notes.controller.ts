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
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CreateNoteDto } from '../dto/create-note.dto.js';
import { UpdateNoteDto } from '../dto/update-note.dto.js';
import { NotesService } from '../services/notes.service.js';

@ApiTags('Opportunity Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities/:opportunityId/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiMessage('Opportunity notes retrieved successfully')
  findAll(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.notesService.findAllForOpportunity(user.id, opportunityId);
  }

  @Post()
  @ApiMessage('Note created successfully')
  create(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(user.id, opportunityId, dto);
  }

  @Patch(':noteId')
  @ApiMessage('Note updated successfully')
  update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('noteId') noteId: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(user.id, opportunityId, noteId, dto);
  }

  @Delete(':noteId')
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Note deleted successfully')
  remove(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.notesService.remove(user.id, opportunityId, noteId);
  }
}
