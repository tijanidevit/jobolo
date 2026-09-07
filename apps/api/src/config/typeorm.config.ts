import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity.js';
import { Opportunity } from '../modules/opportunities/entities/opportunity.entity.js';
import { Activity } from '../modules/opportunities/entities/activity.entity.js';
import { ActivityAttachment } from '../modules/opportunities/entities/activity-attachment.entity.js';
import { Note } from '../modules/notes/entities/note.entity.js';
import { NoteAttachment } from '../modules/notes/entities/note-attachment.entity.js';

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
    entities: [User, Opportunity, Activity, ActivityAttachment, Note, NoteAttachment],
    migrations: ['dist/migrations/*.js'],
    migrationsRun: false,
    // synchronize is ONLY for development. NEVER use in production.
    synchronize: configService.get<string>('app.nodeEnv') === 'development',
    logging: false,
    autoLoadEntities: true,
  }),
};
