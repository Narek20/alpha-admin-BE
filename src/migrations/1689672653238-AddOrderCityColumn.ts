import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddOrderCityColumn1689672653238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order',
      new TableColumn({
        name: 'city',
        type: 'varchar',
        length: '255',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order', 'city')
  }
}
