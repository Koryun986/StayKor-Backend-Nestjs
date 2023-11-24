import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { bigint } from "zod";

@Entity()
export class Token {
  @PrimaryGeneratedColumn({
    type: "bigint",
  })
  id: number;

  @Column({
    unique: true,
  })
  token: string;

  @Column({
    type: "date",
  })
  expiration: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({
    type: "bigint",
  })
  userId: number;
}
