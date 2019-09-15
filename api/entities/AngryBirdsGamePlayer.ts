import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class AngryBirdsGamePlayer {

  @PrimaryColumn()
  gameId: string;

  @PrimaryColumn()
  uuid: string;

  @Column()
  eventId: number;

  @Column()
  playerName: string;

  @Column()
  eaglesDefeated: number;

  @Column()
  hatchlingsRescued: number;

  @Column()
  revives: number;

  @Column()
  wave: number;
}