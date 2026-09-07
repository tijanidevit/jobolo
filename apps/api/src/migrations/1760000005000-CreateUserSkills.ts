import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserSkills1760000005000 implements MigrationInterface {
  name = 'CreateUserSkills1760000005000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_skills',
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
          { name: 'skill', type: 'varchar', length: '100' },
          { name: 'proficiency', type: 'int' },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
        ],
        uniques: [
          {
            name: 'UQ_user_skills_user_skill',
            columnNames: ['userId', 'skill'],
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
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_skills');
  }
}
