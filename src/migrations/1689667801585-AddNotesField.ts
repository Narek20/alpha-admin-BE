import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddNotesField1689667801585 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order',
      new TableColumn({
        name: 'notes',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      'product',
      new TableColumn({
        name: 'notes',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order', 'notes')
    await queryRunner.dropColumn('product', 'notes')
  }
}
