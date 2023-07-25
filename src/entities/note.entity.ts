import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  note: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
