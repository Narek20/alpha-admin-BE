import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserStatus } from "../types/types/user.types";

@Entity()
export class User {
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
}
