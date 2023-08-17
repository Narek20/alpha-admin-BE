import { Entity, Column, PrimaryColumn } from 'typeorm'

class Field {
  @Column()
  title: string

  @Column()
  key: string
}

@Entity()
export class Category {
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
  })
  title: string

  @Column({
    type: 'json',
    nullable: true,
  })
  fields: Field[]
}
