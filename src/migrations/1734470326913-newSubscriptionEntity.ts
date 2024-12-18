import { MigrationInterface, QueryRunner } from "typeorm";

export class NewSubscriptionEntity1734470326913 implements MigrationInterface {
    name = 'NewSubscriptionEntity1734470326913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscription_status_enum" AS ENUM('nothing', 'PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED')`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "status" "public"."subscription_status_enum" NOT NULL DEFAULT 'PENDING', "price" numeric(10,2) NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "autoRenew" boolean NOT NULL DEFAULT true, "userId" uuid, CONSTRAINT "REL_cc906b4bc892b048f1b654d2aa" UNIQUE ("userId"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_8a9059b0a53334b51a75fd81925"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_5eb6d214f29af9e194b16fa2660"`);
        await queryRunner.query(`ALTER TABLE "payment_history" ALTER COLUMN "sportCenterId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_history" ALTER COLUMN "fieldId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_f4a3f141c8f7972ac41f71b28f5"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_1645d93548944c4a0987b290d3f"`);
        await queryRunner.query(`ALTER TYPE "public"."payment_paymentmethod_enum" RENAME TO "payment_paymentmethod_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentmethod_enum" AS ENUM('credit_card', 'paypal', 'mercadopago', 'stripe')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paymentMethod" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paymentMethod" TYPE "public"."payment_paymentmethod_enum" USING "paymentMethod"::"text"::"public"."payment_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paymentMethod" SET DEFAULT 'mercadopago'`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentmethod_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "fieldId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "sportCenterId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."users_subscription_status_enum" RENAME TO "users_subscription_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_subscription_status_enum" AS ENUM('nothing', 'PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "subscription_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "subscription_status" TYPE "public"."users_subscription_status_enum" USING "subscription_status"::"text"::"public"."users_subscription_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "subscription_status" SET DEFAULT 'nothing'`);
        await queryRunner.query(`DROP TYPE "public"."users_subscription_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_8a9059b0a53334b51a75fd81925" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_5eb6d214f29af9e194b16fa2660" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_f4a3f141c8f7972ac41f71b28f5" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_1645d93548944c4a0987b290d3f" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_1645d93548944c4a0987b290d3f"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_f4a3f141c8f7972ac41f71b28f5"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_5eb6d214f29af9e194b16fa2660"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_8a9059b0a53334b51a75fd81925"`);
        await queryRunner.query(`CREATE TYPE "public"."users_subscription_status_enum_old" AS ENUM('pendig', 'authorized', 'paused', 'cancelled', 'nothing')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "subscription_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "subscription_status" TYPE "public"."users_subscription_status_enum_old" USING "subscription_status"::"text"::"public"."users_subscription_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "subscription_status" SET DEFAULT 'nothing'`);
        await queryRunner.query(`DROP TYPE "public"."users_subscription_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_subscription_status_enum_old" RENAME TO "users_subscription_status_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "sportCenterId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "fieldId" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentmethod_enum_old" AS ENUM('credit_card', 'paypal', 'mercadopago')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paymentMethod" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paymentMethod" TYPE "public"."payment_paymentmethod_enum_old" USING "paymentMethod"::"text"::"public"."payment_paymentmethod_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paymentMethod" SET DEFAULT 'mercadopago'`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payment_paymentmethod_enum_old" RENAME TO "payment_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_1645d93548944c4a0987b290d3f" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_f4a3f141c8f7972ac41f71b28f5" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ALTER COLUMN "fieldId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_history" ALTER COLUMN "sportCenterId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_5eb6d214f29af9e194b16fa2660" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_8a9059b0a53334b51a75fd81925" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_status_enum"`);
    }

}
