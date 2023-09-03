import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class UpdateStorageTable1693739407221 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('storage', [
      'importDate',
      'createdAt',
      'updatedAt',
      'storage',
    ])

    await queryRunner.addColumn(
      'storage',
      new TableColumn({
        name: 'title',
        type: 'varchar',
        length: '255',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('order_product', [
      new TableColumn({
        name: 'storage',
        type: 'varchar',
        length: '255',
      }),
      new TableColumn({
        name: 'importDate',
        type: 'varchar',
        length: '255',
      }),
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    ])

    await queryRunner.dropColumn('storage', 'title')
  }
}
