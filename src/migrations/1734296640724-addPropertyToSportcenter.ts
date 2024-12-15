import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropertyToSportcenter1734296640724 implements MigrationInterface {
    name = 'AddPropertyToSportcenter1734296640724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" ADD "averageRating" numeric(2,1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center" DROP COLUMN "averageRating"`);
    }

}
