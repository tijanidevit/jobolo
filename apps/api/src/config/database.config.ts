import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  name: process.env.DB_NAME ?? 'jobolo_dev',
  user: process.env.DB_USER ?? 'root',
  pass: process.env.DB_PASS ?? '',
}));
