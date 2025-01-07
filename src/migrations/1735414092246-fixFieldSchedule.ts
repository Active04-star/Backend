import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFieldSchedule1735414092246 implements MigrationInterface {
    name = 'FixFieldSchedule1735414092246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field_block" DROP CONSTRAINT "FK_b98fe109904743c924c2111843f"`);
        await queryRunner.query(`ALTER TABLE "field_block" RENAME COLUMN "fieldScheduleId" TO "fieldId"`);
        await queryRunner.query(`ALTER TABLE "field" ADD "duration_minutes" integer NOT NULL DEFAULT '60'`);
        await queryRunner.query(`ALTER TABLE "field_block" ADD CONSTRAINT "FK_cb4c0d95a2ea24b569d11ef9781" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field_block" DROP CONSTRAINT "FK_cb4c0d95a2ea24b569d11ef9781"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "duration_minutes"`);
        await queryRunner.query(`ALTER TABLE "field_block" RENAME COLUMN "fieldId" TO "fieldScheduleId"`);
        await queryRunner.query(`ALTER TABLE "field_block" ADD CONSTRAINT "FK_b98fe109904743c924c2111843f" FOREIGN KEY ("fieldScheduleId") REFERENCES "field_schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
