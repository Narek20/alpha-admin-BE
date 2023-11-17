import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddSpecialOrderPrice1700231209866 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'order',
            new TableColumn({
              name: 'specialPrice',
              type: 'int',
              isNullable: true
            }),
          )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('order', 'specialPrice')
    }

}
