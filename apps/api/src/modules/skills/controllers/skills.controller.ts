import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { UpdateSkillsDto } from '../dto/update-skills.dto.js';
import { SkillsQueryDto } from '../dto/skills-query.dto.js';
import { SkillsService } from '../services/skills.service.js';

@ApiTags('Skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiMessage('Skills retrieved successfully')
  profile(
    @CurrentUser() user: IAuthenticatedUser,
    @Query() query: SkillsQueryDto,
  ) {
    return this.skillsService.getIntelligence(user.id, query.sort);
  }

  @Put()
  @ApiMessage('Skills updated successfully')
  updateSkills(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: UpdateSkillsDto,
  ) {
    return this.skillsService.replaceSkills(user.id, dto.skills);
  }
}
