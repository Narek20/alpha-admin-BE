import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddViewsColumnInProduct1698012231989
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'product',
      new TableColumn({ name: 'views', type: 'int', default: 0 }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('product', 'views')
  }
}
