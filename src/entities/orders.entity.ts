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
  ManyToOne,
} from 'typeorm'
import { Product } from './products.entity'
import { Customer } from './customer.entity'
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
  address2: string

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
    default: OrderStatuses.RECEIVED,
  })
  status: string

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

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  paymentMethod: Date

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

  @ManyToOne(() => Customer)
  @JoinTable({ name: 'customer' })
  customer: Customer

  @JoinColumn({
    name: 'order_product',
    referencedColumnName: 'quantity',
  })
  products: Product[]
}
