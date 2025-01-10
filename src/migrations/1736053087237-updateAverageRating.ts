import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAverageRating1736053087237 implements MigrationInterface {
    name = 'UpdateAverageRating1736053087237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "averageRating"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "averageRating" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "averageRating"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "averageRating" numeric(2,1)`);
    }

}
