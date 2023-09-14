import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm'
import { Storage } from './storage.entity'
import { Product } from './products.entity'
import { User } from './users.entity'

@Entity('storage_product')
export class StorageProduct {
  @PrimaryColumn({
    type: 'int',
  })
  id: number

  @Column({
    type: 'int',
  })
  storageId: number

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

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  importDate: string

  @ManyToOne(() => Storage, (storage) => storage.products)
  storage: Storage

  @ManyToOne(() => Product, (product) => product)
  product: Product

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
