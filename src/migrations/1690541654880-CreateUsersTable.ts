import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateUsersTable1690541654880 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'user',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'fullName',
                type: 'varchar',
                length: '255',
              },
              {
                name: 'phone',
                type: 'varchar',
                length: '255',
              },
              {
                name: 'status',
                type: 'varchar',
                length: '255',
              },
              {
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
              },
            ],
          }),
        )
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user')
      }

}
