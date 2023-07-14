import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddQuantityColumnOrdersProducts1689237068248
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order_product',
      new TableColumn({
        name: 'quantity',
        type: 'int',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order_product', 'quantity')
  }
}
