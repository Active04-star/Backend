import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFiel1736363191299 implements MigrationInterface {
    name = 'UpdateFiel1736363191299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" DROP DEFAULT`);
    }

}
