import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddPaymentMethodColumn1689942676579 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order',
      new TableColumn({
        name: 'paymentMethod',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order', 'paymentMathod')
  }
}
