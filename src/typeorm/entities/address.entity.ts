import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
  @PrimaryGeneratedColumn({
    type: "bigint",
  })
  id: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  address: string;
}
