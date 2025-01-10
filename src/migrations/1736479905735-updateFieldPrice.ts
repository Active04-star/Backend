import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldPrice1736479905735 implements MigrationInterface {
    name = 'UpdateFieldPrice1736479905735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "price" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "price" DROP DEFAULT`);
    }

}
