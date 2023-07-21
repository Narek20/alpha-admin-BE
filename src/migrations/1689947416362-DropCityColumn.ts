import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class DropCityColumn1689947416362 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('order', 'city')
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
    }

}
