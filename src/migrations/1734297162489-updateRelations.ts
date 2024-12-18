import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelations1734297162489 implements MigrationInterface {
    name = 'UpdateRelations1734297162489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_e8aad301fef6b8fff9225000ce8"`);
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "sportcenterId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_e8aad301fef6b8fff9225000ce8" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_e8aad301fef6b8fff9225000ce8"`);
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "sportcenterId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_e8aad301fef6b8fff9225000ce8" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
