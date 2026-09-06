import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from './common/decorators/api-message.decorator.js';

/**
 * Health check controller.
 * Used for monitoring, load balancers, and uptime checks.
 */
@ApiTags('health')
@Controller('health')
export class AppController {
  @Get()
  @ApiMessage('API is running')
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'jobolo-api',
    };
  }
}
