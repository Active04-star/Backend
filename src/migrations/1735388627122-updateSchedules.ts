import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchedules1735388627122 implements MigrationInterface {
    name = 'UpdateSchedules1735388627122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" RENAME COLUMN "note" TO "isOpen"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" RENAME COLUMN "status" TO "isOpen"`);
        await queryRunner.query(`ALTER TYPE "public"."field_schedule_status_enum" RENAME TO "field_schedule_isopen_enum"`);
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" DROP COLUMN "isOpen"`);
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" ADD "isOpen" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "field_schedule" DROP COLUMN "isOpen"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ADD "isOpen" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field_schedule" DROP COLUMN "isOpen"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ADD "isOpen" "public"."field_schedule_isopen_enum" NOT NULL DEFAULT 'open'`);
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" DROP COLUMN "isOpen"`);
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" ADD "isOpen" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."field_schedule_isopen_enum" RENAME TO "field_schedule_status_enum"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" RENAME COLUMN "isOpen" TO "status"`);
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" RENAME COLUMN "isOpen" TO "note"`);
    }

}
