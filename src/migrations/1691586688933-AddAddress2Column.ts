import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddAddress2Column1691586688933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order',
      new TableColumn({
        name: 'address2',
        type: 'varchar',
        isNullable: true
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order', 'address2')
  }
}
