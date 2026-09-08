import {
  Body,
  BadRequestException,
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
import { CreateResumeDto } from '../dto/create-resume.dto.js';
import { UpdateResumeDto } from '../dto/update-resume.dto.js';
import {
  ResumesService,
  type UploadedResumeFile,
} from '../services/resumes.service.js';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

@ApiTags('Resumes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  @ApiMessage('Resumes retrieved successfully')
  findAll(@CurrentUser() user: IAuthenticatedUser) {
    return this.resumesService.findAllForUser(user.id);
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
  @ApiMessage('Resume uploaded successfully')
  create(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: CreateResumeDto,
    @UploadedFile() file: UploadedResumeFile,
  ) {
    if (!file) {
      throw new BadRequestException(
        'A PDF, DOC, or DOCX resume file is required',
      );
    }
    return this.resumesService.create(user.id, dto, file);
  }

  @Patch(':id')
  @ApiMessage('Resume updated successfully')
  update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateResumeDto,
  ) {
    return this.resumesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiMessage('Resume deleted successfully')
  async remove(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.resumesService.remove(id, user.id);
  }

  @Get(':id/file')
  getFile(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    return this.resumesService
      .getFile(id, user.id)
      .then((file) =>
        response.type(file.mimeType).download(file.path, file.originalName),
      );
  }
}
