import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export class RemoveCategoryForeignKey1695556216033
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('product', 'FK_product_categoryTitle')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
}
