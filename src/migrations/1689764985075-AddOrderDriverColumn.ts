import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddOrderDriverColumn1689764985075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order',
      new TableColumn({
        name: 'driver',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order', 'driver')
  }
}
