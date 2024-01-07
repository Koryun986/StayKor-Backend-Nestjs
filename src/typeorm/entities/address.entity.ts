import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
