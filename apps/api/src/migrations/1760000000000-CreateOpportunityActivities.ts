import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateOpportunityActivities1760000000000 implements MigrationInterface {
  name = 'CreateOpportunityActivities1760000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'opportunity_activities',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'userId', type: 'varchar', length: '36' },
          { name: 'opportunityId', type: 'varchar', length: '36' },
          { name: 'type', type: 'varchar', length: '50' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'occurredAt', type: 'datetime' },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      }),
    );
    await queryRunner.createIndex(
      'opportunity_activities',
      new TableIndex({ name: 'IDX_activity_user', columnNames: ['userId'] }),
    );
    await queryRunner.createIndex(
      'opportunity_activities',
      new TableIndex({
        name: 'IDX_activity_opportunity',
        columnNames: ['opportunityId'],
      }),
    );
    await queryRunner.createIndex(
      'opportunity_activities',
      new TableIndex({
        name: 'IDX_activity_timeline',
        columnNames: ['opportunityId', 'occurredAt'],
      }),
    );
    await queryRunner.createForeignKey(
      'opportunity_activities',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'opportunity_activities',
      new TableForeignKey({
        columnNames: ['opportunityId'],
        referencedTableName: 'opportunities',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('opportunity_activities');
  }
}
