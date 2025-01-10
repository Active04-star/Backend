import { MigrationInterface, QueryRunner } from "typeorm";

export class ReviewAndReservationRelacionChanged1735679096288 implements MigrationInterface {
    name = 'ReviewAndReservationRelacionChanged1735679096288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_6092dc76fd1f8116f740083997c"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "UQ_6092dc76fd1f8116f740083997c"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "reviewId"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "reservationId" uuid`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "UQ_9b7f8df5ee0c46b5cd3e09e56d8" UNIQUE ("reservationId")`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_9b7f8df5ee0c46b5cd3e09e56d8" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_9b7f8df5ee0c46b5cd3e09e56d8"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "UQ_9b7f8df5ee0c46b5cd3e09e56d8"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "reservationId"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "reviewId" uuid`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "UQ_6092dc76fd1f8116f740083997c" UNIQUE ("reviewId")`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_6092dc76fd1f8116f740083997c" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
