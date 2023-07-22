import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Product } from './products.entity'

class Field {
  @Column()
  title: string

  @Column()
  key: string
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
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
