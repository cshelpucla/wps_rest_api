import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { isDate } from "util";

export class TestMigration1562792389713 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "test",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: "firstName",
                    type: "varchar"
                },
                {
                    name: "lastName",
                    type: "varchar"
                },
                {
                    name: "age",
                    type: "int"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("test");
    }

}
