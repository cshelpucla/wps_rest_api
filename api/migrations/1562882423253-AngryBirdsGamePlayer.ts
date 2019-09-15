import {MigrationInterface, Table, QueryRunner} from "typeorm";

export class AngryBirdsGamePlayer1562882423253 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "angry_birds_game_player",
            columns: [
                {
                    name: "gameId",
                    type: "varchar",
                    isPrimary: true,
                },
                {
                    name: "uuid",
                    type: "varchar",
                    isPrimary: true,
                },
                {
                    name: "eventId",
                    type: "int"
                },
                {
                    name: "playerName",
                    type: "varchar"
                },
                {
                    name: "eaglesDefeated",
                    type: "int"
                },
                {
                    name: "hatchlingsRescued",
                    type: "int"
                },
                {
                    name: "revives",
                    type: "int"
                },
                {
                    name: "wave",
                    type: "int"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("angry_birds_game_player");
    }

}
