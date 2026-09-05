import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '../modules/users/entities/user.entity.js';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    database: configService.get<string>('database.name'),
    username: configService.get<string>('database.user'),
    password: configService.get<string>('database.pass'),
    entities: [UserEntity],
    migrations: ['dist/migrations/*.js'],
    migrationsRun: false,
    // synchronize is ONLY for development. NEVER use in production.
    synchronize: configService.get<string>('app.nodeEnv') === 'development',
    logging: configService.get<string>('app.nodeEnv') === 'development',
    autoLoadEntities: true,
  }),
};
