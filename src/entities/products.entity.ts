import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
    nullable: true,
  })
  sizes: string;

  @Column({
    type: "int",
    nullable: false,
  })
  price: number;
}
