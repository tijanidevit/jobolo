import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOpportunityInterviews1760000005000 implements MigrationInterface {
  name = 'CreateOpportunityInterviews1760000005000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'opportunity_interviews',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'varchar', length: '36' },
          { name: 'opportunityId', type: 'varchar', length: '36' },
          { name: 'type', type: 'varchar', length: '50' },
          { name: 'scheduledAt', type: 'datetime' },
          { name: 'durationMinutes', type: 'int', isNullable: true },
          { name: 'interviewers', type: 'text', isNullable: true },
          { name: 'meetingLocation', type: 'varchar', length: '2048', isNullable: true },
          { name: 'stage', type: 'varchar', length: '100', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'performanceRating', type: 'tinyint', isNullable: true },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP(6)' },
          { name: 'updatedAt', type: 'datetime', default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' },
        ],
      }),
      true,
    );
    await queryRunner.createIndex('opportunity_interviews', new TableIndex({ name: 'IDX_interview_user', columnNames: ['userId'] }));
    await queryRunner.createIndex('opportunity_interviews', new TableIndex({ name: 'IDX_interview_opportunity_scheduled', columnNames: ['opportunityId', 'scheduledAt'] }));
    await queryRunner.createForeignKey('opportunity_interviews', new TableForeignKey({ columnNames: ['userId'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('opportunity_interviews', new TableForeignKey({ columnNames: ['opportunityId'], referencedTableName: 'opportunities', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('opportunity_interviews');
  }
}
