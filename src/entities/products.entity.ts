import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Order } from './orders.entity'
import { Category } from './category.entity'
import { Store } from './store.entity'

class Size {
  @Column()
  size: string

  @Column()
  smSize: string

  @Column()
  quantity: number
}

class AdditionalInfo {
  @Column()
  title: string

  @Column()
  value: string
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  category: string

  @Column({
    type: 'json',
    nullable: true,
  })
  sizes: Size[]

  @Column({
    type: 'varchar',
    length: 255,
  })
  brand: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  rating: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  country: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  color: string

  @Column({
    type: 'bool',
    nullable: true,
  })
  isBest: boolean

  @Column({
    type: 'int',
  })
  price: number

  @Column({
    type: 'int',
    default: 0,
  })
  purchasePrice: number

  @Column({
    type: 'json',
    nullable: true,
  })
  additionalInfo: AdditionalInfo[]

  @Column({
    type: 'int',
  })
  views: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @ManyToMany(() => Order)
  @JoinTable({ name: 'order_product' })
  orders: Order[]

  @ManyToMany(() => Store)
  @JoinTable({ name: 'store_product' })
  stores: Store[]
}
