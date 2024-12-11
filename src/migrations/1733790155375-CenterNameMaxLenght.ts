import { MigrationInterface, QueryRunner } from "typeorm";

export class CenterNameMaxLenght1733790155375 implements MigrationInterface {
    name = 'CenterNameMaxLenght1733790155375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."sport_center_status_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "address" character varying(120) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."sport_center_status_enum" AS ENUM('draft', 'published', 'banned')`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "status" "public"."sport_center_status_enum" NOT NULL DEFAULT 'draft'`);
    }

}
