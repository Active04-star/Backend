import { MigrationInterface, QueryRunner } from "typeorm";

export class SoftDeletes1734466540701 implements MigrationInterface {
    name = 'SoftDeletes1734466540701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "field" ADD "isACtive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "isACtive"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "isDeleted"`);
    }

}
