import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm'
import { Store } from './store.entity'
import { Product } from './products.entity'

@Entity('order_product')
export class StoreProduct {
  @PrimaryColumn({
    type: 'int',
  })
  id: number

  @Column({
    type: 'int',
  })
  storeId: number

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

  @ManyToOne(() => Store, (store) => store.products)
  store: Store

  @ManyToOne(() => Product, (product) => product.stores)
  product: Product
}
