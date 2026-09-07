import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOpportunityNextAction1760000007000 implements MigrationInterface {
  name = 'AddOpportunityNextAction1760000007000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'opportunities',
      new TableColumn({ name: 'nextAction', type: 'varchar', length: '500', isNullable: true }),
    );
    await queryRunner.addColumn(
      'opportunities',
      new TableColumn({ name: 'nextActionDueDate', type: 'datetime', isNullable: true }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('opportunities', 'nextActionDueDate');
    await queryRunner.dropColumn('opportunities', 'nextAction');
  }
}
