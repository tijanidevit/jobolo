import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class LinkOpportunityNextActionTask1760000008000 implements MigrationInterface {
  name = 'LinkOpportunityNextActionTask1760000008000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'opportunities',
      new TableColumn({
        name: 'nextActionTaskId',
        type: 'varchar',
        length: '36',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'opportunities',
      new TableForeignKey({
        name: 'FK_opportunities_next_action_task',
        columnNames: ['nextActionTaskId'],
        referencedTableName: 'opportunity_tasks',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'opportunities',
      'FK_opportunities_next_action_task',
    );
    await queryRunner.dropColumn('opportunities', 'nextActionTaskId');
  }
}
