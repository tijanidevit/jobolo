import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateActivityAttachments1760000001000 implements MigrationInterface {
  name = 'CreateActivityAttachments1760000001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'opportunity_activity_attachments',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
          },
          { name: 'activityId', type: 'varchar', length: '36' },
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
            columnNames: ['activityId'],
            referencedTableName: 'opportunity_activities',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('opportunity_activity_attachments');
  }
}
