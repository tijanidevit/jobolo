import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CreateCoverLetterDto } from '../dto/create-cover-letter.dto.js';
import { UpdateCoverLetterDto } from '../dto/update-cover-letter.dto.js';
import {
  CoverLettersService,
  type UploadedCoverLetterFile,
} from '../services/cover-letters.service.js';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

@ApiTags('Cover Letters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cover-letters')
export class CoverLettersController {
  constructor(private readonly coverLettersService: CoverLettersService) {}

  @Get()
  @ApiMessage('Cover letters retrieved successfully')
  findAll(@CurrentUser() user: IAuthenticatedUser) {
    return this.coverLettersService.findAllForUser(user.id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        callback(null, ALLOWED_MIME_TYPES.has(file.mimetype));
      },
    }),
  )
  @ApiMessage('Cover letter uploaded successfully')
  create(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateCoverLetterDto,
    @UploadedFile() file: UploadedCoverLetterFile,
  ) {
    if (!file) {
      throw new BadRequestException(
        'A PDF, DOC, or DOCX cover letter file is required',
      );
    }
    return this.coverLettersService.create(user.id, dto, file);
  }

  @Patch(':id')
  @ApiMessage('Cover letter updated successfully')
  update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCoverLetterDto,
  ) {
    return this.coverLettersService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiMessage('Cover letter deleted successfully')
  async remove(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.coverLettersService.remove(id, user.id);
  }

  @Get(':id/file')
  getFile(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    return this.coverLettersService
      .getFile(id, user.id)
      .then((file) =>
        response.type(file.mimeType).download(file.path, file.originalName),
      );
  }
}
