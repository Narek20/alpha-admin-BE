import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddCashbackColumnInOrders1698012746357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'order',
            new TableColumn({
              name: 'cashback',
              type: 'int',
              isNullable: true
            }),
          )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('order', 'cashback')
    }
}
