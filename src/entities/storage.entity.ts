import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
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
  })
  storage: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  importDate: string

  @OneToMany(() => Product, (product) => product)
  products: Product[]

  @JoinTable({ name: 'product' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
