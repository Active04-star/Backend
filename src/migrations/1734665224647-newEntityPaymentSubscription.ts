import { MigrationInterface, QueryRunner } from "typeorm";

export class NewEntityPaymentSubscription1734665224647 implements MigrationInterface {
    name = 'NewEntityPaymentSubscription1734665224647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscription_payment_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TYPE "public"."subscription_payment_paymentmethod_enum" AS ENUM('credit_card', 'paypal', 'mercadopago', 'stripe')`);
        await queryRunner.query(`CREATE TABLE "subscription_payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "status" "public"."subscription_payment_status_enum" NOT NULL DEFAULT 'pending', "paymentMethod" "public"."subscription_payment_paymentmethod_enum" NOT NULL DEFAULT 'stripe', "isPaid" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "subscriptionId" uuid, CONSTRAINT "PK_25f8afce4159ee83cf8c6da622d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."payment_type_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ADD CONSTRAINT "FK_2a17e8d0eea74a5607de6aa549a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ADD CONSTRAINT "FK_ca1d88ef8c0ad9a244bffa4376e" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_payment" DROP CONSTRAINT "FK_ca1d88ef8c0ad9a244bffa4376e"`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" DROP CONSTRAINT "FK_2a17e8d0eea74a5607de6aa549a"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "description" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."payment_type_enum" AS ENUM('subscription', 'reservation')`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "type" "public"."payment_type_enum" NOT NULL DEFAULT 'subscription'`);
        await queryRunner.query(`DROP TABLE "subscription_payment"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_payment_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_payment_status_enum"`);
    }

}
