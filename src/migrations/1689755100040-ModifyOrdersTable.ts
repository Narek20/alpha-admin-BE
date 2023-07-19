import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class ModifyOrdersTable1689755100040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order', 'city')

    await queryRunner.addColumn(
      'order',
      new TableColumn({
        name: 'deliveryDate',
        type: 'timestamp',
        isNullable: true
      })
    )
    await queryRunner.addColumn(
      'order',
      new TableColumn({
        name: 'isSpecial',
        type: 'bool',
        default: false,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order',
      new TableColumn({
        name: 'city',
        type: 'varchar',
        length: '255',
      })
    )
    await queryRunner.dropColumn('order', 'deliveryDate')
    await queryRunner.dropColumn('order', 'isSpecial')
  }
}
