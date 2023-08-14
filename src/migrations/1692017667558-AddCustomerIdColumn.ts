import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddCustomerIdColumn1692017667558 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
        'order',
        new TableColumn({
          name: 'customerId',
          type: 'integer',
        }),
      )

      
    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['customerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customer',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order', 'customerId')
    await queryRunner.dropForeignKey('order', 'customerId')
  }
}
