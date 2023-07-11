import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProductsTable1689067771594 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'sizes',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'brand',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'clasp',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'rating',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'season',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'weight',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'shoesHeight',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'color',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'isBest',
            type: 'bool',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'purchasePrice',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product')
  }
}
