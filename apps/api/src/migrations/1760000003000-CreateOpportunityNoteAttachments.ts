import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOpportunityNoteAttachments1760000003000 implements MigrationInterface {
  name = 'CreateOpportunityNoteAttachments1760000003000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'opportunity_note_attachments',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
          },
          { name: 'noteId', type: 'varchar', length: '36' },
          { name: 'originalName', type: 'varchar', length: '255' },
          {
            name: 'storedName',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          { name: 'mimeType', type: 'varchar', length: '255' },
          { name: 'size', type: 'int' },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['noteId'],
            referencedTableName: 'opportunity_notes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('opportunity_note_attachments');
  }
}
