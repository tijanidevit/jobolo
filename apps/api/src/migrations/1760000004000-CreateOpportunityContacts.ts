import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOpportunityContacts1760000004000 implements MigrationInterface {
  name = 'CreateOpportunityContacts1760000004000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'opportunity_contacts',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: 'varchar', length: '36' },
          { name: 'opportunityId', type: 'varchar', length: '36' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'jobTitle', type: 'varchar', length: '255', isNullable: true },
          { name: 'email', type: 'varchar', length: '255', isNullable: true },
          { name: 'phone', type: 'varchar', length: '50', isNullable: true },
          { name: 'linkedin', type: 'varchar', length: '1024', isNullable: true },
          { name: 'relationship', type: 'varchar', length: '100', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'createdAt', type: 'datetime', default: 'CURRENT_TIMESTAMP(6)' },
          { name: 'updatedAt', type: 'datetime', default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' },
        ],
      }),
      true,
    );
    await queryRunner.createIndex('opportunity_contacts', new TableIndex({ name: 'IDX_contact_user', columnNames: ['userId'] }));
    await queryRunner.createIndex('opportunity_contacts', new TableIndex({ name: 'IDX_contact_opportunity', columnNames: ['opportunityId'] }));
    await queryRunner.createIndex('opportunity_contacts', new TableIndex({ name: 'IDX_contact_user_opportunity', columnNames: ['userId', 'opportunityId'] }));
    await queryRunner.createForeignKey('opportunity_contacts', new TableForeignKey({ columnNames: ['userId'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('opportunity_contacts', new TableForeignKey({ columnNames: ['opportunityId'], referencedTableName: 'opportunities', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('opportunity_contacts');
  }
}
