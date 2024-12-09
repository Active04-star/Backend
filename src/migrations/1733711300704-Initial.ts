import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1733711300704 implements MigrationInterface {
    name = 'Initial1733711300704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentmethod_enum" AS ENUM('credit_card', 'paypal', 'mercadopago')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "price" numeric(10,2) NOT NULL, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending', "paymentMethod" "public"."payment_paymentmethod_enum" NOT NULL DEFAULT 'mercadopago', CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reservations_status_enum" AS ENUM('pending', 'active', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "date" TIMESTAMP NOT NULL, "status" "public"."reservations_status_enum" NOT NULL DEFAULT 'pending', "paymentId" uuid, "userId" uuid NOT NULL, "fieldId" uuid NOT NULL, CONSTRAINT "REL_f8dbec76216ec5e4ef78cdecbc" UNIQUE ("paymentId"), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_subscription_status_enum" AS ENUM('pendig', 'authorized', 'paused', 'cancelled', 'nothing')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('manager', 'user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "profile_image" character varying, "password" character varying(128), "subscription_status" "public"."users_subscription_status_enum" NOT NULL DEFAULT 'nothing', "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "was_banned" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "rating" integer NOT NULL, "comment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isEdited" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP, "userId" uuid, "sportcenterId" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "photos" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "url" character varying NOT NULL, "sportcenterId" uuid, CONSTRAINT "PK_5220c45b8e32d49d767b9b3d725" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sport_center" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "address" character varying NOT NULL, "managerId" uuid NOT NULL, CONSTRAINT "PK_f5f0e4c3831527a6a90d88adbca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."field_status_enum" AS ENUM('available', 'occupied')`);
        await queryRunner.query(`CREATE TABLE "field" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "number" integer NOT NULL, "status" "public"."field_status_enum" NOT NULL DEFAULT 'available', "sportCategoryId" uuid, "sportcenterId" uuid, CONSTRAINT "PK_39379bba786d7a75226b358f81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sport_category" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "logo" character varying, "sportcenterId" uuid NOT NULL, CONSTRAINT "PK_9299fc3bd34556dd08cc76a05fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_f8dbec76216ec5e4ef78cdecbcf" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_2f1b878f400f2fab4533292bc23" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_401655510019dd287c96f240ddd" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "photos" ADD CONSTRAINT "FK_665b5e72669f6a3ea036796f226" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD CONSTRAINT "FK_17a47f80b38cc65592e7eaaadb1" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_bd326596002865b3b2452aeebb1" FOREIGN KEY ("sportCategoryId") REFERENCES "sport_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_e8aad301fef6b8fff9225000ce8" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_category" ADD CONSTRAINT "FK_7aa8ad1f639edc765d2df07705f" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_category" DROP CONSTRAINT "FK_7aa8ad1f639edc765d2df07705f"`);
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_e8aad301fef6b8fff9225000ce8"`);
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_bd326596002865b3b2452aeebb1"`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP CONSTRAINT "FK_17a47f80b38cc65592e7eaaadb1"`);
        await queryRunner.query(`ALTER TABLE "photos" DROP CONSTRAINT "FK_665b5e72669f6a3ea036796f226"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_401655510019dd287c96f240ddd"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_2f1b878f400f2fab4533292bc23"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_f8dbec76216ec5e4ef78cdecbcf"`);
        await queryRunner.query(`DROP TABLE "sport_category"`);
        await queryRunner.query(`DROP TABLE "field"`);
        await queryRunner.query(`DROP TYPE "public"."field_status_enum"`);
        await queryRunner.query(`DROP TABLE "sport_center"`);
        await queryRunner.query(`DROP TABLE "photos"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_subscription_status_enum"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_status_enum"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    }

}
