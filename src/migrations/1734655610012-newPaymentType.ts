import { MigrationInterface, QueryRunner } from "typeorm";

export class NewPaymentType1734655610012 implements MigrationInterface {
    name = 'NewPaymentType1734655610012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_type_enum" AS ENUM('subscription', 'reservation')`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "type" "public"."payment_type_enum" NOT NULL DEFAULT 'subscription'`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."payment_type_enum"`);
    }

}
