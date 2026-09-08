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
import { Resume } from '../entities/resume.entity.js';
import type { CreateResumeDto } from '../dto/create-resume.dto.js';
import type { UpdateResumeDto } from '../dto/update-resume.dto.js';

export interface UploadedResumeFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumesRepository: Repository<Resume>,
  ) {}

  findAllForUser(userId: string) {
    return this.resumesRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async create(userId: string, dto: CreateResumeDto, file: UploadedResumeFile) {
    const storedName = `${Date.now()}-${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    await fs.mkdir(uploadDirectory('resumes'), { recursive: true });
    await fs.writeFile(uploadFilePath('resumes', storedName), file.buffer);

    try {
      return await this.resumesRepository.save(
        this.resumesRepository.create({
          userId,
          name: dto.name.trim(),
          originalName: file.originalname,
          storedName,
          mimeType: file.mimetype,
          size: file.size,
        }),
      );
    } catch (error) {
      await fs.rm(uploadFilePath('resumes', storedName), { force: true });
      throw error;
    }
  }

  async update(id: string, userId: string, dto: UpdateResumeDto) {
    const resume = await this.findOne(id, userId);
    if (dto.name !== undefined) resume.name = dto.name.trim();
    return this.resumesRepository.save(resume);
  }

  async remove(id: string, userId: string) {
    const resume = await this.findOne(id, userId);
    await this.resumesRepository.remove(resume);
    await fs.rm(uploadFilePath('resumes', resume.storedName), { force: true });
  }

  async getFile(id: string, userId: string) {
    const resume = await this.findOne(id, userId);
    return {
      path: uploadFilePath('resumes', resume.storedName),
      mimeType: resume.mimeType,
      originalName: resume.originalName,
    };
  }

  private async findOne(id: string, userId: string) {
    const resume = await this.resumesRepository.findOne({
      where: { id, userId },
    });
    if (!resume) throw new NotFoundException('Resume not found');
    return resume;
  }
}
