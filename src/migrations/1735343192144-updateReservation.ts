import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReservation1735343192144 implements MigrationInterface {
    name = 'UpdateReservation1735343192144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_270f90c2a63ebdc5b9ec48261a4"`);
        await queryRunner.query(`CREATE TYPE "public"."field_block_status_enum" AS ENUM('AVAILABLE', 'RESERVED')`);
        await queryRunner.query(`CREATE TABLE "field_block" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "status" "public"."field_block_status_enum" NOT NULL DEFAULT 'AVAILABLE', "fieldScheduleId" uuid, CONSTRAINT "PK_5a83de9373c941b3399f3531685" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "field_schedule" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "fieldScheduleId"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ADD "opening_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ADD "closing_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "fieldBlockId" uuid`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "UQ_0a04183596f31d781cad0fa00bf" UNIQUE ("fieldBlockId")`);
        await queryRunner.query(`ALTER TABLE "field_block" ADD CONSTRAINT "FK_b98fe109904743c924c2111843f" FOREIGN KEY ("fieldScheduleId") REFERENCES "field_schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_0a04183596f31d781cad0fa00bf" FOREIGN KEY ("fieldBlockId") REFERENCES "field_block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_0a04183596f31d781cad0fa00bf"`);
        await queryRunner.query(`ALTER TABLE "field_block" DROP CONSTRAINT "FK_b98fe109904743c924c2111843f"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "UQ_0a04183596f31d781cad0fa00bf"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "fieldBlockId"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" DROP COLUMN "closing_time"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" DROP COLUMN "opening_time"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "fieldScheduleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ADD "end_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ADD "start_time" TIME NOT NULL`);
        await queryRunner.query(`DROP TABLE "field_block"`);
        await queryRunner.query(`DROP TYPE "public"."field_block_status_enum"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_270f90c2a63ebdc5b9ec48261a4" FOREIGN KEY ("fieldScheduleId") REFERENCES "field_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
