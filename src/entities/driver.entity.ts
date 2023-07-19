import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'
import { DriverStatus } from '../types/types/driver.types'

@Entity()
export class Driver {
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
  direction: string

  @Column({
    type: 'varchar',
    length: 255,
    enum: DriverStatus,
    default: DriverStatus.FREE,
  })
  status: DriverStatus

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
