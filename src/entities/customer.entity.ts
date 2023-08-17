import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'
import { Order } from './orders.entity'

@Entity()
export class Customer {
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
    nullable: true
  })
  address: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true

  })
  address2: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  notes: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  notes2: string

  @Column({
    type: 'int',
  })
  cashback: number

  @Column({
    type: 'int',
  })
  cashback_money: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];
}
