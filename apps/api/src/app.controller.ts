import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Health check controller.
 * Used for monitoring, load balancers, and uptime checks.
 */
@ApiTags('health')
@Controller('health')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API health check' })
  @ApiResponse({ status: 200, description: 'API is running' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'jobolo-api',
    };
  }
}
