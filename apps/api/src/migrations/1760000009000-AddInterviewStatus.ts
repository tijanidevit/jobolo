import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddInterviewStatus1760000009000 implements MigrationInterface {
  name = 'AddInterviewStatus1760000009000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'opportunity_interviews',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '20',
        default: "'scheduled'",
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('opportunity_interviews', 'status');
  }
}
