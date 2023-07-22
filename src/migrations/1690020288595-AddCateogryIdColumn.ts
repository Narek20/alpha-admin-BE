import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export class AddCateogryIdColumn1690020288595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'product',
      new TableColumn({
        name: 'categoryId',
        type: 'integer',
        isNullable: true,
      }),
    )

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product')
    const foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('categoryId'),
    )
    if (foreignKey) {
      await queryRunner.dropForeignKey('product', foreignKey)
    }
    await queryRunner.dropColumn('product', 'categoryId')
  }
}
