import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Address } from "./address.entity";

@Entity()
export class Lodging {
  @PrimaryGeneratedColumn({
    type: "bigint",
  })
  id: number;

  @Column()
  price: string;

  @Column({
    type: "longtext",
  })
  description: string;

  @OneToOne(() => Address)
  address: Address;

  @Column({
    type: "bigint",
  })
  addressId: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: "bigint",
  })
  userId: number;
}
