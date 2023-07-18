import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddSizeColumn1689670138181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order_product',
      new TableColumn({
        name: 'size',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order_product', 'size')
  }
}
