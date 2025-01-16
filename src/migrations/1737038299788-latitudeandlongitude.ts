import { MigrationInterface, QueryRunner } from "typeorm";

export class Latitudeandlongitude1737038299788 implements MigrationInterface {
    name = 'Latitudeandlongitude1737038299788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "longitude" double precision`);
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "price" SET DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "price" SET DEFAULT 0.00`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "latitude"`);
    }

}
