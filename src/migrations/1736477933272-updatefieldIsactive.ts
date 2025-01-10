import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatefieldIsactive1736477933272 implements MigrationInterface {
    name = 'UpdatefieldIsactive1736477933272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "isACtive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "isACtive" SET DEFAULT false`);
    }

}
