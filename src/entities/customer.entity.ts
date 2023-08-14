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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];
}
