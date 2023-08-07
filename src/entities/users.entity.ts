import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'
import { UserStatus } from '../types/types/user.types'

@Entity()
export class User {
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
  login: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string

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
