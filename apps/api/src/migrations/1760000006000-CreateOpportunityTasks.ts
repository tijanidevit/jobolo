import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOpportunityTasks1760000006000 implements MigrationInterface {
  name = 'CreateOpportunityTasks1760000006000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'opportunity_tasks',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'varchar', length: '36' },
          { name: 'opportunityId', type: 'varchar', length: '36' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'dueDate', type: 'datetime', isNullable: true },
          { name: 'priority', type: 'varchar', length: '20', default: "'medium'" },
          { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
          { name: 'reminderAt', type: 'datetime', isNullable: true },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP(6)' },
          { name: 'updatedAt', type: 'datetime', default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' },
        ],
      }),
      true,
    );
    await queryRunner.createIndex('opportunity_tasks', new TableIndex({ name: 'IDX_task_user', columnNames: ['userId'] }));
    await queryRunner.createIndex('opportunity_tasks', new TableIndex({ name: 'IDX_task_opportunity_due', columnNames: ['opportunityId', 'dueDate'] }));
    await queryRunner.createForeignKey('opportunity_tasks', new TableForeignKey({ columnNames: ['userId'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('opportunity_tasks', new TableForeignKey({ columnNames: ['opportunityId'], referencedTableName: 'opportunities', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('opportunity_tasks');
  }
}
