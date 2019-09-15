import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class AngryBirdsGameCallback {

  @PrimaryColumn({unique: true})
  gameId: number;

  @Column()
  eventId: number;

  @Column("text")
  body: string;

}