import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAiIntelligence1760000010000 implements MigrationInterface {
  name = 'CreateAiIntelligence1760000010000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'opportunity_fit_scores',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'userId', type: 'varchar', length: '36' },
          { name: 'opportunityId', type: 'varchar', length: '36' },
          { name: 'overallScore', type: 'tinyint' },
          { name: 'technicalSkillsScore', type: 'tinyint' },
          { name: 'experienceScore', type: 'tinyint' },
          { name: 'seniorityScore', type: 'tinyint' },
          { name: 'industryScore', type: 'tinyint' },
          { name: 'locationScore', type: 'tinyint' },
          { name: 'matchedSkills', type: 'json' },
          { name: 'missingSkills', type: 'json' },
          { name: 'rationale', type: 'text' },
          { name: 'provider', type: 'varchar', length: '20' },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
        ],
        indices: [{ name: 'IDX_fit_user_opportunity', columnNames: ['userId', 'opportunityId'] }],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'interview_preparations',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'userId', type: 'varchar', length: '36' },
          { name: 'opportunityId', type: 'varchar', length: '36' },
          { name: 'likelyQuestions', type: 'json' },
          { name: 'technicalQuestions', type: 'json' },
          { name: 'behavioralQuestions', type: 'json' },
          { name: 'systemDesignQuestions', type: 'json' },
          { name: 'studyTopics', type: 'json' },
          { name: 'provider', type: 'varchar', length: '20' },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
        ],
        indices: [{ name: 'IDX_preparation_user_opportunity', columnNames: ['userId', 'opportunityId'] }],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'interview_memories',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'userId', type: 'varchar', length: '36' },
          { name: 'opportunityId', type: 'varchar', length: '36' },
          { name: 'interviewId', type: 'varchar', length: '36' },
          { name: 'sourceText', type: 'text' },
          { name: 'interviewers', type: 'json' },
          { name: 'questions', type: 'json' },
          { name: 'topics', type: 'json' },
          { name: 'commitments', type: 'json' },
          { name: 'followUpActions', type: 'json' },
          { name: 'weaknesses', type: 'json' },
          { name: 'provider', type: 'varchar', length: '20' },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
        ],
        indices: [{ name: 'IDX_memory_user_interview', columnNames: ['userId', 'interviewId'] }],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('interview_memories');
    await queryRunner.dropTable('interview_preparations');
    await queryRunner.dropTable('opportunity_fit_scores');
  }
}
