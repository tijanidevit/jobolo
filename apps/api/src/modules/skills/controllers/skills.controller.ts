import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { UpdateSkillProfileDto } from '../dto/update-skill-profile.dto.js';
import { SkillsService } from '../services/skills.service.js';

@ApiTags('Skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get('profile')
  @ApiMessage('Skill profile retrieved successfully')
  profile(@CurrentUser() user: IAuthenticatedUser) {
    return this.skillsService.getProfile(user.id);
  }

  @Put('profile')
  @ApiMessage('Skill profile updated successfully')
  updateProfile(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: UpdateSkillProfileDto,
  ) {
    return this.skillsService.replaceProfile(user.id, dto.skills);
  }

  @Get('intelligence')
  @ApiMessage('Skill intelligence retrieved successfully')
  intelligence(@CurrentUser() user: IAuthenticatedUser) {
    return this.skillsService.getIntelligence(user.id);
  }
}
