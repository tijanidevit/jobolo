import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateOpportunityNotes1760000002000 implements MigrationInterface {
  name = 'CreateOpportunityNotes1760000002000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'opportunity_notes',
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
          { name: 'content', type: 'text' },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      }),
    );
    await queryRunner.createIndex(
      'opportunity_notes',
      new TableIndex({ name: 'IDX_note_user', columnNames: ['userId'] }),
    );
    await queryRunner.createIndex(
      'opportunity_notes',
      new TableIndex({
        name: 'IDX_note_opportunity',
        columnNames: ['opportunityId'],
      }),
    );
    await queryRunner.createIndex(
      'opportunity_notes',
      new TableIndex({
        name: 'IDX_note_user_opportunity',
        columnNames: ['userId', 'opportunityId'],
      }),
    );
    await queryRunner.createForeignKey(
      'opportunity_notes',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'opportunity_notes',
      new TableForeignKey({
        columnNames: ['opportunityId'],
        referencedTableName: 'opportunities',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('opportunity_notes');
  }
}
