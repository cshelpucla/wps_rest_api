import {MigrationInterface, Table, QueryRunner} from "typeorm";

export class custQueryDef1563994638287 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "custom_query_def",
            columns: [
                { name: "id",                type: "int",  isPrimary: true, },
                { name: "query_type",        type: "varchar" },
                { name: "query_name",        type: "varchar" },
                { name: "experience_id",     type: "int"     },
                { name: "experience_slug",   type: "varchar" },
                { name: "query_param1_name", type: "varchar" },
                { name: "query_param1_type", type: "varchar" },
                { name: "query_param2_name", type: "varchar" },
                { name: "query_param2_type", type: "varchar" },
                { name: "query_param3_name", type: "varchar" },
                { name: "query_param3_type", type: "varchar" },
                { name: "query_param4_name", type: "varchar" },
                { name: "query_param4_type", type: "varchar" },
                { name: "query_text",        type: "mediumtext" },
                { name: "query_html",        type: "mediumtext" },
                { name: "version",           type: "varchar" },
                { name: "current",           type: "varchar" },
                { name: "created_at",        type: "datetime" },
                { name: "updated_at",        type: "datetime" },
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("cust_query_def");
    }

}
