import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Customer } from './customer.entity'
import { StoreProduct } from './storeProducts.entity'
import { Product } from './products.entity'

@Entity()
export class Store {
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
    nullable: true,
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
    type: 'int',
    default: 0,
  })
  specialPrice: number

  @Column({
    type: 'int',
    nullable: true,
  })
  cashback: number

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

  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.store, {
    cascade: true,
  })
  storeProducts: StoreProduct[]

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'store_product',
    joinColumn: {
      name: 'storeId',
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
    name: 'store_product',
    referencedColumnName: 'quantity',
  })
  products: Product[]
}
