import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateResumesAndLinkOpportunities1760000005000 implements MigrationInterface {
  name = 'CreateResumesAndLinkOpportunities1760000005000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'resumes',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
          },
          { name: 'userId', type: 'varchar', length: '36' },
          { name: 'name', type: 'varchar', length: '255' },
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
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
    await queryRunner.addColumn(
      'opportunities',
      new TableColumn({
        name: 'resumeId',
        type: 'varchar',
        length: '36',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'opportunities',
      new TableForeignKey({
        columnNames: ['resumeId'],
        referencedTableName: 'resumes',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const opportunities = await queryRunner.getTable('opportunities');
    const resumeForeignKey = opportunities?.foreignKeys.find((key) =>
      key.columnNames.includes('resumeId'),
    );
    if (resumeForeignKey)
      await queryRunner.dropForeignKey('opportunities', resumeForeignKey);
    await queryRunner.dropColumn('opportunities', 'resumeId');
    await queryRunner.dropTable('resumes');
  }
}
