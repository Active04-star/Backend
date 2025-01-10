import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnum1735386602027 implements MigrationInterface {
    name = 'UpdateEnum1735386602027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."field_schedule_status_enum" RENAME TO "field_schedule_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."field_schedule_status_enum" AS ENUM('open', 'closed')`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ALTER COLUMN "status" TYPE "public"."field_schedule_status_enum" USING "status"::"text"::"public"."field_schedule_status_enum"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ALTER COLUMN "status" SET DEFAULT 'open'`);
        await queryRunner.query(`DROP TYPE "public"."field_schedule_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."field_schedule_status_enum_old" AS ENUM('available', 'occupied')`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ALTER COLUMN "status" TYPE "public"."field_schedule_status_enum_old" USING "status"::"text"::"public"."field_schedule_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ALTER COLUMN "status" SET DEFAULT 'available'`);
        await queryRunner.query(`DROP TYPE "public"."field_schedule_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."field_schedule_status_enum_old" RENAME TO "field_schedule_status_enum"`);
    }

}
