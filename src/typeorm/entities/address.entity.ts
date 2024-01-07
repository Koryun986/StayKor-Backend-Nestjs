import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lodging } from "./lodging.entity";

@ObjectType()
@Entity()
export class Address {
  @Field(() => Int)
  @PrimaryGeneratedColumn({
    type: "bigint",
  })
  id: number;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  address: string;

  @OneToOne(() => Lodging)
  lodging: Lodging;

  @Column({
    type: "bigint",
  })
  lodgingId: number;
}
