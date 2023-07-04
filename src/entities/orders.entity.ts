import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { UserStatus } from "../types/types/user.types";
import { Product } from "./products.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: "varchar",
    length: 255,
    enum: UserStatus,
    default: UserStatus.USER
  })
  status: UserStatus;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
