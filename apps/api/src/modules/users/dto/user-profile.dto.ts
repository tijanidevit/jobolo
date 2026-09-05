import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import type { User } from '../entities/user.entity.js';

/**
 * User profile response DTO.
 * Never includes passwordHash, tokens, or other sensitive internal fields.
 */
export class UserProfileResponse {
  @ApiProperty({ description: 'User unique identifier (UUID)' })
  id: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'First name' })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ description: 'Full name (computed)' })
  fullName: string;

  @ApiProperty({ description: 'Whether the email address has been verified' })
  emailVerified: boolean;

  @ApiProperty({ description: 'Account creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Account last-updated timestamp' })
  updatedAt: Date;

  static fromEntity(user: User): UserProfileResponse {
    const dto = new UserProfileResponse();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.fullName = user.fullName;
    dto.emailVerified = user.emailVerified;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'First name', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;
}
