import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeoptions1736441956952 implements MigrationInterface {
    name = 'AddCascadeoptions1736441956952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_bd326596002865b3b2452aeebb1"`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_bd326596002865b3b2452aeebb1" FOREIGN KEY ("sportCategoryId") REFERENCES "sport_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_bd326596002865b3b2452aeebb1"`);
        await queryRunner.query(`ALTER TABLE "subscription_payment" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_bd326596002865b3b2452aeebb1" FOREIGN KEY ("sportCategoryId") REFERENCES "sport_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
