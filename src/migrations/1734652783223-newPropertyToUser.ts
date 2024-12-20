import { MigrationInterface, QueryRunner } from "typeorm";

export class NewPropertyToUser1734652783223 implements MigrationInterface {
    name = 'NewPropertyToUser1734652783223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "stripeCustomerId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "stripeCustomerId"`);
    }

}
