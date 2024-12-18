import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSportcenterEntity1733778973231 implements MigrationInterface {
    name = 'UpdateSportcenterEntity1733778973231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sport_center_status_enum" AS ENUM('draft', 'published', 'banned')`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "status" "public"."sport_center_status_enum" NOT NULL DEFAULT 'draft'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."sport_center_status_enum"`);
    }

}
