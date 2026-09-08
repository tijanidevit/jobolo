import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateCoverLettersAndLinkOpportunities1760000006000 implements MigrationInterface {
  name = 'CreateCoverLettersAndLinkOpportunities1760000006000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cover_letters',
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
          {
            name: 'template',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'style', type: 'varchar', length: '20' },
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
        name: 'coverLetterId',
        type: 'varchar',
        length: '36',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'opportunities',
      new TableForeignKey({
        columnNames: ['coverLetterId'],
        referencedTableName: 'cover_letters',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const opportunities = await queryRunner.getTable('opportunities');
    const foreignKey = opportunities?.foreignKeys.find((key) =>
      key.columnNames.includes('coverLetterId'),
    );
    if (foreignKey)
      await queryRunner.dropForeignKey('opportunities', foreignKey);
    await queryRunner.dropColumn('opportunities', 'coverLetterId');
    await queryRunner.dropTable('cover_letters');
  }
}
