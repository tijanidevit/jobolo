import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'node:fs';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import {
  uploadDirectory,
  uploadFilePath,
} from '../../../common/files/upload-path.js';
import type { CreateCoverLetterDto } from '../dto/create-cover-letter.dto.js';
import type { UpdateCoverLetterDto } from '../dto/update-cover-letter.dto.js';
import { CoverLetter } from '../entities/cover-letter.entity.js';

export interface UploadedCoverLetterFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class CoverLettersService {
  constructor(
    @InjectRepository(CoverLetter)
    private readonly coverLettersRepository: Repository<CoverLetter>,
  ) {}

  findAllForUser(userId: string) {
    return this.coverLettersRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async create(
    userId: string,
    dto: CreateCoverLetterDto,
    file: UploadedCoverLetterFile,
  ) {
    const storedName = `${Date.now()}-${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    await fs.mkdir(uploadDirectory('cover-letters'), { recursive: true });
    await fs.writeFile(
      uploadFilePath('cover-letters', storedName),
      file.buffer,
    );

    try {
      return await this.coverLettersRepository.save(
        this.coverLettersRepository.create({
          userId,
          name: dto.name.trim(),
          template: dto.template?.trim() || null,
          style: dto.style,
          originalName: file.originalname,
          storedName,
          mimeType: file.mimetype,
          size: file.size,
        }),
      );
    } catch (error) {
      await fs.rm(uploadFilePath('cover-letters', storedName), { force: true });
      throw error;
    }
  }

  async update(id: string, userId: string, dto: UpdateCoverLetterDto) {
    const coverLetter = await this.findOne(id, userId);
    if (dto.name !== undefined) coverLetter.name = dto.name.trim();
    if (dto.template !== undefined)
      coverLetter.template = dto.template.trim() || null;
    if (dto.style !== undefined) coverLetter.style = dto.style;
    return this.coverLettersRepository.save(coverLetter);
  }

  async remove(id: string, userId: string) {
    const coverLetter = await this.findOne(id, userId);
    await this.coverLettersRepository.remove(coverLetter);
    await fs.rm(uploadFilePath('cover-letters', coverLetter.storedName), {
      force: true,
    });
  }

  async getFile(id: string, userId: string) {
    const coverLetter = await this.findOne(id, userId);
    return {
      path: uploadFilePath('cover-letters', coverLetter.storedName),
      mimeType: coverLetter.mimeType,
      originalName: coverLetter.originalName,
    };
  }

  private async findOne(id: string, userId: string) {
    const coverLetter = await this.coverLettersRepository.findOne({
      where: { id, userId },
    });
    if (!coverLetter) throw new NotFoundException('Cover letter not found');
    return coverLetter;
  }
}
