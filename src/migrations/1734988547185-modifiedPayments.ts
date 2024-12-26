import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedPayments1734988547185 implements MigrationInterface {
    name = 'ModifiedPayments1734988547185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_05479e112ec684756677f91a567"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_34d643de1a588d2350297da5c24"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_5eb6d214f29af9e194b16fa2660"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_8a9059b0a53334b51a75fd81925"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_a3219994ab452282c74ef6de2ca"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP COLUMN "paymentId"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP COLUMN "sportCenterId"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP COLUMN "fieldId"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "REL_05479e112ec684756677f91a56"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP COLUMN "reservationId"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "historyId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "UQ_1fe03f85961553f83068eddfd59" UNIQUE ("historyId")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_1fe03f85961553f83068eddfd59" FOREIGN KEY ("historyId") REFERENCES "payment_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_1fe03f85961553f83068eddfd59"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "UQ_1fe03f85961553f83068eddfd59"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "historyId"`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD "reservationId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "REL_05479e112ec684756677f91a56" UNIQUE ("reservationId")`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD "fieldId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD "sportCenterId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD "paymentId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_a3219994ab452282c74ef6de2ca" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_8a9059b0a53334b51a75fd81925" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_5eb6d214f29af9e194b16fa2660" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_34d643de1a588d2350297da5c24" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_05479e112ec684756677f91a567" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
