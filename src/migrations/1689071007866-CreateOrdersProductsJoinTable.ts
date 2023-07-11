import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CreateOrdersProductsJoinTable1689071007866
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_product',
        columns: [
          {
            name: 'orderId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'productId',
            type: 'int',
            isNullable: false,
          },
        ],
      })
    )

    await queryRunner.createForeignKeys('order_product', [
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'order',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['productId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_product')
    const foreignKeyOrderId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('orderId') !== -1
    )
    
    const foreignKeyProductId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('productId') !== -1
    )

    await queryRunner.dropForeignKey('order_product', foreignKeyOrderId)
    await queryRunner.dropForeignKey('order_product', foreignKeyProductId)
    await queryRunner.dropTable('order_product')
  }
}
