import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class ModifyCustomerTable1692278351207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('customer', [
      new TableColumn({
        name: 'cashback',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'cashback_money',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'address',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'address2',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'notes',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'notes2',
        type: 'varchar',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('customer', [
      'cashback',
      'cashback_money',
      'address',
      'address2',
      'notes',
      'notes2'
    ])
  }
}
