import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { UsersService } from '../services/users.service.js';
import { UserProfileResponse, UpdateProfileDto } from '../dto/user-profile.dto.js';

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Profile retrieved successfully')
  async getProfile(@CurrentUser() user: IAuthenticatedUser) {
    const userEntity = await this.usersService.findById(user.id);
    return UserProfileResponse.fromEntity(userEntity);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Profile updated successfully')
  async updateProfile(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    const updated = await this.usersService.updateProfile(user.id, dto);
    return UserProfileResponse.fromEntity(updated);
  }
}
