import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReservation1735259558151 implements MigrationInterface {
    name = 'UpdateReservation1735259558151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" ADD "fieldScheduleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_270f90c2a63ebdc5b9ec48261a4" FOREIGN KEY ("fieldScheduleId") REFERENCES "field_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_270f90c2a63ebdc5b9ec48261a4"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "fieldScheduleId"`);
    }

}
