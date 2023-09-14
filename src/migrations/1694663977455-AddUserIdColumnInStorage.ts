import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export class AddUserIdColumnInStorage1694663977455
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'storage_product',
      new TableColumn({
        name: 'userId',
        type: 'int',
        isNullable: true,
      }),
    )

    await queryRunner.createForeignKey(
      'storage_product',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('storage_product', 'userId')
    await queryRunner.dropForeignKey('storage_product', 'userId')
  }
}
