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
    await queryRunner.dropForeignKey('product', 'categoryId')

    await queryRunner.dropPrimaryKey('category')

    await queryRunner.createPrimaryKey('category', ['title'])

    await queryRunner.dropColumn('category', 'id')

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        name: 'product',
        columnNames: ['categoryId'],
        referencedTableName: 'category',
        referencedColumnNames: ['title'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('product', 'categoryId')

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

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        name: 'product',
        columnNames: ['categoryId'],
        referencedTableName: 'category',
        referencedColumnNames: ['id'],
      }),
    )
  }
}
