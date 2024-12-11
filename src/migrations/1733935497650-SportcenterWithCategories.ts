import { MigrationInterface, QueryRunner } from "typeorm";

export class SportcenterWithCategories1733935497650 implements MigrationInterface {
    name = 'SportcenterWithCategories1733935497650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rating" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "userId" uuid, "sportCenterId" uuid, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "authtoken" character varying`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "address" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."sport_center_status_enum" RENAME TO "sport_center_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."sport_center_status_enum" AS ENUM('draft', 'published', 'disable', 'banned')`);
        await queryRunner.query(`ALTER TABLE "sport_center" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sport_center" ALTER COLUMN "status" TYPE "public"."sport_center_status_enum" USING "status"::"text"::"public"."sport_center_status_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ALTER COLUMN "status" SET DEFAULT 'draft'`);
        await queryRunner.query(`DROP TYPE "public"."sport_center_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_a6c53dfc89ba3188b389ef29a62" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_fb47bd9d12907d7937208bc376a" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_fb47bd9d12907d7937208bc376a"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_a6c53dfc89ba3188b389ef29a62"`);
        await queryRunner.query(`CREATE TYPE "public"."sport_center_status_enum_old" AS ENUM('draft', 'published', 'banned')`);
        await queryRunner.query(`ALTER TABLE "sport_center" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "sport_center" ALTER COLUMN "status" TYPE "public"."sport_center_status_enum_old" USING "status"::"text"::"public"."sport_center_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ALTER COLUMN "status" SET DEFAULT 'draft'`);
        await queryRunner.query(`DROP TYPE "public"."sport_center_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."sport_center_status_enum_old" RENAME TO "sport_center_status_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "authtoken"`);
        await queryRunner.query(`DROP TABLE "rating"`);
    }

}
