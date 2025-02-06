import { MigrationInterface, QueryRunner } from "typeorm";

export class SettingsAndSessionInfoFixed1738808752672 implements MigrationInterface {
    name = 'SettingsAndSessionInfoFixed1738808752672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_settings" ("user_id" uuid NOT NULL, "session_limit" integer NOT NULL DEFAULT '60', "reservation_notification" boolean NOT NULL DEFAULT true, "reservation_cancelled" boolean NOT NULL DEFAULT true, "reservation_reminder" boolean NOT NULL DEFAULT true, "reservation_sync" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4ed056b9344e6f7d8d46ec4b302" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_login" TIMESTAMP DEFAULT '"2000-10-19T23:15:30.000Z"'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "account_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "price" SET DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "price" SET DEFAULT 0.00`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "account_verified"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login"`);
        await queryRunner.query(`DROP TABLE "user_settings"`);
    }

}
