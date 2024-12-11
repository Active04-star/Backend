import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthTokenParaUser1733877332756 implements MigrationInterface {
    name = 'AuthTokenParaUser1733877332756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rating" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "userId" uuid, "sportCenterId" uuid, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."sport_center_status_enum" AS ENUM('draft', 'published', 'banned')`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "status" "public"."sport_center_status_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "authtoken" character varying`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_a6c53dfc89ba3188b389ef29a62" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_fb47bd9d12907d7937208bc376a" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_fb47bd9d12907d7937208bc376a"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_a6c53dfc89ba3188b389ef29a62"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "authtoken"`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."sport_center_status_enum"`);
        await queryRunner.query(`DROP TABLE "rating"`);
    }

}
