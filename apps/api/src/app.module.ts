import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config.js';
import databaseConfig from './config/database.config.js';
import jwtConfig from './config/jwt.config.js';
import mailConfig from './config/mail.config.js';
import { typeOrmConfig } from './config/typeorm.config.js';
import { AppController } from './app.controller.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { MailModule } from './modules/mail/mail.module.js';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module.js';
import { NotesModule } from './modules/notes/notes.module.js';
import { ContactsModule } from './modules/contacts/contacts.module.js';
import { InterviewsModule } from './modules/interviews/interviews.module.js';
import { TasksModule } from './modules/tasks/tasks.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { SkillsModule } from './modules/skills/skills.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, mailConfig],
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    MailModule,
    AuthModule,
    UsersModule,
    OpportunitiesModule,
    NotesModule,
    ContactsModule,
    InterviewsModule,
    TasksModule,
    DashboardModule,
    AnalyticsModule,
    SkillsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
