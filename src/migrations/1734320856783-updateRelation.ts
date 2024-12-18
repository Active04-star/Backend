import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelation1734320856783 implements MigrationInterface {
    name = 'UpdateRelation1734320856783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_category" ADD CONSTRAINT "UQ_9675eb2cbbd81132986bbbf4af9" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_category" DROP CONSTRAINT "UQ_9675eb2cbbd81132986bbbf4af9"`);
    }

}
