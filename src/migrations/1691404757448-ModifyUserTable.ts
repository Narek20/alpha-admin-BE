import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class ModifyUserTable1691404757448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'phone')

    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'login',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'password',
        type: 'varchar',
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'phone',
        type: 'varchar',
      }),
    )

    await queryRunner.dropColumns('user', ['login', 'password'])
  }
}
