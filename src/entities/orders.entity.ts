import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Product } from './products.entity'
import { OrderProduct } from './orderProducts.entity'
import { OrderStatuses } from '../types/types/order.types'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
  })
  fullName: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  phone: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  address: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  notes: string

  @Column({
    type: 'bool',
    default: false,
  })
  isSpecial: boolean

  @Column({
    type: 'varchar',
    length: 255,
    enum: OrderStatuses,
    default: OrderStatuses.RECEIVED,
  })
  status: OrderStatuses

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  driver: string

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deliveryDate: Date

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  orderProducts: OrderProduct[]

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'order_product',
    joinColumn: {
      name: 'orderId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
  })
  @JoinColumn({
    name: 'order_product',
    referencedColumnName: 'quantity',
  })
  products: Product[]
}
