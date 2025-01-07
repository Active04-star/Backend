import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSportcenterSchedule1736284738238 implements MigrationInterface {
    name = 'UpdateSportcenterSchedule1736284738238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" ALTER COLUMN "opening_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" ALTER COLUMN "closing_time" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" ALTER COLUMN "closing_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" ALTER COLUMN "opening_time" SET NOT NULL`);
    }

}
