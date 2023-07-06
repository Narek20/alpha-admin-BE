import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  category: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  sizes: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  brand: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  rating: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  color: string;

  @Column({
    type: "bool",
    nullable: true,
  })
  isBest: boolean;

  @Column({
    type: "int",
    nullable: false,
  })
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}