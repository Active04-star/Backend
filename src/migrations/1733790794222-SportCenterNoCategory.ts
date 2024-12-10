import { MigrationInterface, QueryRunner } from "typeorm";

export class SportCenterNoCategory1733790794222 implements MigrationInterface {
    name = 'SportCenterNoCategory1733790794222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_category" DROP CONSTRAINT "FK_7aa8ad1f639edc765d2df07705f"`);
        await queryRunner.query(`ALTER TABLE "sport_category" DROP COLUMN "sportcenterId"`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "address" character varying(120) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_category" ADD "sportcenterId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_category" ADD CONSTRAINT "FK_7aa8ad1f639edc765d2df07705f" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
