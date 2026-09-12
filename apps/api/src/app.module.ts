import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config.js';
import databaseConfig from './config/database.config.js';
import jwtConfig from './config/jwt.config.js';
import mailConfig from './config/mail.config.js';
import aiConfig from './config/ai.config.js';
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
import { InsightsModule } from './modules/insights/insights.module.js';
import { ResumesModule } from './modules/resumes/resumes.module.js';
import { CoverLettersModule } from './modules/cover-letters/cover-letters.module.js';
import { SalaryIntelligenceModule } from './modules/salary-intelligence/salary-intelligence.module.js';
import { JobDescriptionAnalysisModule } from './modules/job-description-analysis/job-description-analysis.module.js';
import { AiModule } from './modules/ai/ai.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, mailConfig, aiConfig],
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
    InsightsModule,
    ResumesModule,
    CoverLettersModule,
    SalaryIntelligenceModule,
    JobDescriptionAnalysisModule,
    AiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
