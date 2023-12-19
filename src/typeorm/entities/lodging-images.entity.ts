import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lodging } from "./lodging.entity";

@Entity()
export class LodgingImages {
  @PrimaryGeneratedColumn({
    type: "bigint",
  })
  id: number;

  @OneToOne(() => Lodging)
  lodging: Lodging;

  @Column({
    type: "bigint",
  })
  lodgingId: number;

  @Column({
    type: "string",
    array: true,
  })
  downloadUrls: string[];
}
