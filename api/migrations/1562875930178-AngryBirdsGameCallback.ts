import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class AngryBirdsGameCallback1562875930178 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "angry_birds_game_callback",
            columns: [
                {
                    name: "gameId",
                    type: "varchar",
                    isPrimary: true,
                },
                {
                    name: "eventId",
                    type: "int"
                },
                {
                    name: "body",
                    type: "text"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("angry_birds_game_callback");
    }

}
