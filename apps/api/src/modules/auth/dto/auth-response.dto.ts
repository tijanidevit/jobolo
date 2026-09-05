import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensResponse {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'Access token expiry (seconds)' })
  expiresIn: number;
}

export class MessageResponse {
  @ApiProperty()
  message: string;
}
