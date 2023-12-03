import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export class AddStoreFieldsToOthers1701628998090 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'customer',
      new TableColumn({
        name: 'storeId',
        type: 'int',
        isNullable: true,
      }),
    )

    await queryRunner.createForeignKey(
      'customer',
      new TableForeignKey({
        columnNames: ['storeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'store',
        onDelete: 'CASCADE',
      }),
    )

    await queryRunner.addColumn(
      'product',
      new TableColumn({
        name: 'storeId',
        type: 'int',
        isNullable: true,
      }),
    )

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['storeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('customer', 'storeId')
    await queryRunner.dropColumn('customer', 'storeId')
    await queryRunner.dropForeignKey('product', 'storeId')
    await queryRunner.dropColumn('product', 'storeId')
  }
}
