import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from 'typeorm'

export class CreateStorageProductTable1693737877799
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'storage_product',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'storageId',
            type: 'int',
          },
          {
            name: 'productId',
            type: 'int',
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
          {
            name: 'importDate',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
      }),
    )

    await queryRunner.createForeignKeys('storage_product', [
      new TableForeignKey({
        columnNames: ['storageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'storage',
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
    const table = await queryRunner.getTable('storage_product')
    const foreignKeyStorageId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('storageId') !== -1,
    )

    const foreignKeyProductId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('productId') !== -1,
    )

    await queryRunner.dropForeignKey('storage_product', foreignKeyStorageId)
    await queryRunner.dropForeignKey('storage_product', foreignKeyProductId)
    await queryRunner.dropTable('storage_product')
  }
}
