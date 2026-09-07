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
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CreateNoteDto } from '../dto/create-note.dto.js';
import { UpdateNoteDto } from '../dto/update-note.dto.js';
import {
  NotesService,
  type UploadedNoteFile,
} from '../services/notes.service.js';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';

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
    @Query() query: PaginationQueryDto,
  ) {
    return this.notesService.findAllForOpportunity(
      user.id,
      opportunityId,
      query.page,
      query.limit,
    );
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiMessage('Note created successfully')
  create(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Body() dto: CreateNoteDto,
    @UploadedFiles() files: UploadedNoteFile[],
  ) {
    return this.notesService.create(user.id, opportunityId, dto, files ?? []);
  }

  @Patch(':noteId')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiMessage('Note updated successfully')
  update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('noteId') noteId: string,
    @Body() dto: UpdateNoteDto,
    @UploadedFiles() files: UploadedNoteFile[],
  ) {
    return this.notesService.update(
      user.id,
      opportunityId,
      noteId,
      dto,
      files ?? [],
    );
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

  @Get(':noteId/attachments/:storedName')
  async getAttachment(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('noteId') noteId: string,
    @Param('storedName') storedName: string,
    @Res() response: Response,
  ) {
    const attachment = await this.notesService.getAttachment(
      user.id,
      opportunityId,
      noteId,
      storedName,
    );
    return response.type(attachment.mimeType).sendFile(attachment.path);
  }
}
