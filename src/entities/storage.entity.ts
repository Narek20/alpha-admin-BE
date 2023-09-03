import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Product } from './products.entity'

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  title: string

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'storage_product',
    joinColumn: {
      name: 'storageId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
  })
  products: Product[]
}
