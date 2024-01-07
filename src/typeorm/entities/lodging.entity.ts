import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Address } from "./address.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class Lodging {
  @Field(() => Int)
  @PrimaryGeneratedColumn({
    type: "bigint",
  })
  id: number;

  @Field()
  @Column()
  price: string;

  @Field()
  @Column({
    type: "longtext",
  })
  description: string;

  @Field(() => Address)
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
