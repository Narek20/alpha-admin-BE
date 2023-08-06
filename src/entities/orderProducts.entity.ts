import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm'
import { Order } from './orders.entity'
import { Product } from './products.entity'

@Entity('order_product')
export class OrderProduct {
  @PrimaryColumn({
    type: 'int',
  })
  id: number

  @Column({
    type: 'int',
  })
  orderId: number

  @Column({
    type: 'int',
  })
  productId: number

  @Column({
    type: 'int',
  })
  quantity: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  size: string

  @ManyToOne(() => Order, (order) => order.products)
  order: Order

  @ManyToOne(() => Product, (product) => product.orders)
  product: Product
}
