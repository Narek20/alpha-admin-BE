import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserStatus } from '../types/types/user.types'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  fullName: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  phone: string

  @Column({
    type: 'varchar',
    length: 255,
    enum: UserStatus,
    default: UserStatus.USER,
  })
  status: UserStatus

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
