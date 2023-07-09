import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  category: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  sizes: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  selectedSizes: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  smSizes: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  brand: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  clasp: string

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
  gender: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  season: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  weight: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  shoesHeight: string

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
    nullable: false,
  })
  price: number

  @Column({
    type: 'int',
    nullable: false,
  })
  purchasePrice: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
