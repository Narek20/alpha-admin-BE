import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CreateStoreProductsTable1701627792791
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'store_product',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'storeId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'productId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'size',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
      }),
    )

    await queryRunner.createForeignKeys('store_product', [
      new TableForeignKey({
        columnNames: ['storeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'store',
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
    const table = await queryRunner.getTable('store_product')
    const foreignKeyStoreId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('storeId') !== -1,
    )

    const foreignKeyProductId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('productId') !== -1,
    )

    await queryRunner.dropForeignKey('store_product', foreignKeyStoreId)
    await queryRunner.dropForeignKey('store_product', foreignKeyProductId)
    await queryRunner.dropTable('store_product')
  }
}
