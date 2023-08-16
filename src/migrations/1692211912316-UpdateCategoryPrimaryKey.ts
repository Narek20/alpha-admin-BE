import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export class UpdateCategoryPrimaryKey1692211912316
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'product',
      'FK_ff0c0301a95e517153df97f6812',
    )

    await queryRunner.dropPrimaryKey('category')

    await queryRunner.createPrimaryKey('category', ['title'])

    await queryRunner.dropColumn('category', 'id')

    await queryRunner.addColumn(
      'product',
      new TableColumn({
        name: 'category',
        type: 'varchar',
        isNullable: false,
      }),
    )

    await queryRunner.dropColumn('product', 'categoryId')

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        name: 'FK_product_categoryTitle',
        columnNames: ['category'],
        referencedTableName: 'category',
        referencedColumnNames: ['title'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('product', 'FK_product_categoryTitle')

    await queryRunner.dropPrimaryKey('category')

    await queryRunner.addColumn(
      'category',
      new TableColumn({
        name: 'id',
        type: 'int',
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    )

    await queryRunner.createPrimaryKey('category', ['id'])

    await queryRunner.addColumn(
      'product',
      new TableColumn({
        name: 'categoryId',
        type: 'int',
      }),
    )

    await queryRunner.dropColumn('product', 'category')

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        name: 'FK_ff0c0301a95e517153df97f6812',
        columnNames: ['categoryId'],
        referencedTableName: 'category',
        referencedColumnNames: ['id'],
      }),
    )
  }
}
