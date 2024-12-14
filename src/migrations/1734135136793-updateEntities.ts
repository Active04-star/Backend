import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntities1734135136793 implements MigrationInterface {
    name = 'UpdateEntities1734135136793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_category" DROP CONSTRAINT "FK_7aa8ad1f639edc765d2df07705f"`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP CONSTRAINT "FK_17a47f80b38cc65592e7eaaadb1"`);
        await queryRunner.query(`ALTER TABLE "field" RENAME COLUMN "status" TO "price"`);
        await queryRunner.query(`ALTER TYPE "public"."field_status_enum" RENAME TO "field_price_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_center" RENAME COLUMN "managerId" TO "mainManagerId"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_history_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "payment_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL, "status" "public"."payment_history_status_enum" NOT NULL, "paymentId" uuid NOT NULL, "userId" uuid NOT NULL, "sportCenterId" uuid NOT NULL, "fieldId" uuid NOT NULL, "reservationId" uuid, CONSTRAINT "REL_05479e112ec684756677f91a56" UNIQUE ("reservationId"), CONSTRAINT "PK_5fcec51a769b65c0c3c0987f11c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."sportcenter_schedules_day_enum" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`);
        await queryRunner.query(`CREATE TABLE "sportcenter_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" "public"."sportcenter_schedules_day_enum" NOT NULL, "note" character varying, "opening_time" TIME NOT NULL, "closing_time" TIME NOT NULL, "sportcenterId" uuid NOT NULL, CONSTRAINT "PK_13612d700f74ea173bfc90621ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."field_schedule_status_enum" AS ENUM('available', 'occupied')`);
        await queryRunner.query(`CREATE TABLE "field_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "duration_minutes" integer NOT NULL DEFAULT '60', "status" "public"."field_schedule_status_enum" NOT NULL DEFAULT 'available', "fieldId" uuid NOT NULL, "sportcenterScheduleId" uuid NOT NULL, CONSTRAINT "PK_31299faef97509077bcebbb3c93" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image_url" character varying NOT NULL, "sportcenterId" uuid, "fieldId" uuid, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sport_center_managers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sportCenterId" uuid, CONSTRAINT "PK_a55cc8af5d33bb7c3bb3a8a4a86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_managers_list" ("sportCenterManagersId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_226a6bee0827d96e1df7beca136" PRIMARY KEY ("sportCenterManagersId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4be5f702dc5221bdfbf806dddb" ON "user_managers_list" ("sportCenterManagersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_54c349b125f8ed73f307485a19" ON "user_managers_list" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "sport_center_sport_categories_sport_category" ("sportCenterId" uuid NOT NULL, "sportCategoryId" uuid NOT NULL, CONSTRAINT "PK_0498bbf4eeb4303cbcd45295c51" PRIMARY KEY ("sportCenterId", "sportCategoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8bc1bc332720b85c892576c830" ON "sport_center_sport_categories_sport_category" ("sportCenterId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cb746fb43fe02754f0469a7c88" ON "sport_center_sport_categories_sport_category" ("sportCategoryId") `);
        await queryRunner.query(`ALTER TABLE "sport_category" DROP COLUMN "sportcenterId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "amount" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "fieldId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "sportCenterId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "reservationId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "UQ_6bb61cbede7c869adde5587f345" UNIQUE ("reservationId")`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "reviewId" uuid`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "UQ_6092dc76fd1f8116f740083997c" UNIQUE ("reviewId")`);
        await queryRunner.query(`ALTER TABLE "review" ADD "fieldId" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."reservations_status_enum" RENAME TO "reservations_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."reservations_status_enum" AS ENUM('pending', 'active', 'cancelled', 'completed')`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "status" TYPE "public"."reservations_status_enum" USING "status"::"text"::"public"."reservations_status_enum"`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."reservations_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "field" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_image" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_image" SET DEFAULT 'https://res.cloudinary.com/dvgvcleky/image/upload/f_auto,q_auto/v1/RestO/ffgx6ywlaix0mb3jghux'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_391ec083d0f3c30adda12317dce" UNIQUE ("authtoken")`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('main_manager', 'manager', 'user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_a3219994ab452282c74ef6de2ca" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_34d643de1a588d2350297da5c24" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_8a9059b0a53334b51a75fd81925" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_5eb6d214f29af9e194b16fa2660" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_history" ADD CONSTRAINT "FK_05479e112ec684756677f91a567" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_f4a3f141c8f7972ac41f71b28f5" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_1645d93548944c4a0987b290d3f" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_6bb61cbede7c869adde5587f345" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_6092dc76fd1f8116f740083997c" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" ADD CONSTRAINT "FK_f8735c30a2a16964584f487b304" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ADD CONSTRAINT "FK_103fb7d01ecf19bf2298788ea3a" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field_schedule" ADD CONSTRAINT "FK_53ae52492bffa2e6d55d181a460" FOREIGN KEY ("sportcenterScheduleId") REFERENCES "sportcenter_schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_8fca73db0e706f656f0c0685380" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_80e337b866122843d717f32ebba" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_center_managers" ADD CONSTRAINT "FK_22a3b83d2c63efce32ab9328e00" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD CONSTRAINT "FK_1c127737197b539e4a2ed2abadb" FOREIGN KEY ("mainManagerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_93bebc7742c4d69b196c2d75049" FOREIGN KEY ("fieldId") REFERENCES "field"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_managers_list" ADD CONSTRAINT "FK_4be5f702dc5221bdfbf806dddb3" FOREIGN KEY ("sportCenterManagersId") REFERENCES "sport_center_managers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_managers_list" ADD CONSTRAINT "FK_54c349b125f8ed73f307485a19f" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_center_sport_categories_sport_category" ADD CONSTRAINT "FK_8bc1bc332720b85c892576c8305" FOREIGN KEY ("sportCenterId") REFERENCES "sport_center"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "sport_center_sport_categories_sport_category" ADD CONSTRAINT "FK_cb746fb43fe02754f0469a7c88f" FOREIGN KEY ("sportCategoryId") REFERENCES "sport_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_center_sport_categories_sport_category" DROP CONSTRAINT "FK_cb746fb43fe02754f0469a7c88f"`);
        await queryRunner.query(`ALTER TABLE "sport_center_sport_categories_sport_category" DROP CONSTRAINT "FK_8bc1bc332720b85c892576c8305"`);
        await queryRunner.query(`ALTER TABLE "user_managers_list" DROP CONSTRAINT "FK_54c349b125f8ed73f307485a19f"`);
        await queryRunner.query(`ALTER TABLE "user_managers_list" DROP CONSTRAINT "FK_4be5f702dc5221bdfbf806dddb3"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_93bebc7742c4d69b196c2d75049"`);
        await queryRunner.query(`ALTER TABLE "sport_center" DROP CONSTRAINT "FK_1c127737197b539e4a2ed2abadb"`);
        await queryRunner.query(`ALTER TABLE "sport_center_managers" DROP CONSTRAINT "FK_22a3b83d2c63efce32ab9328e00"`);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_80e337b866122843d717f32ebba"`);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_8fca73db0e706f656f0c0685380"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" DROP CONSTRAINT "FK_53ae52492bffa2e6d55d181a460"`);
        await queryRunner.query(`ALTER TABLE "field_schedule" DROP CONSTRAINT "FK_103fb7d01ecf19bf2298788ea3a"`);
        await queryRunner.query(`ALTER TABLE "sportcenter_schedules" DROP CONSTRAINT "FK_f8735c30a2a16964584f487b304"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_6092dc76fd1f8116f740083997c"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_6bb61cbede7c869adde5587f345"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_1645d93548944c4a0987b290d3f"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_f4a3f141c8f7972ac41f71b28f5"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_05479e112ec684756677f91a567"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_5eb6d214f29af9e194b16fa2660"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_8a9059b0a53334b51a75fd81925"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_34d643de1a588d2350297da5c24"`);
        await queryRunner.query(`ALTER TABLE "payment_history" DROP CONSTRAINT "FK_a3219994ab452282c74ef6de2ca"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('manager', 'user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_391ec083d0f3c30adda12317dce"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_image" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "field" ADD "price" "public"."field_price_enum" NOT NULL DEFAULT 'available'`);
        await queryRunner.query(`CREATE TYPE "public"."reservations_status_enum_old" AS ENUM('pending', 'active', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "status" TYPE "public"."reservations_status_enum_old" USING "status"::"text"::"public"."reservations_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."reservations_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."reservations_status_enum_old" RENAME TO "reservations_status_enum"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "fieldId"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "UQ_6092dc76fd1f8116f740083997c"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "reviewId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "UQ_6bb61cbede7c869adde5587f345"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "reservationId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "sportCenterId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "fieldId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sport_category" ADD "sportcenterId" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb746fb43fe02754f0469a7c88"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8bc1bc332720b85c892576c830"`);
        await queryRunner.query(`DROP TABLE "sport_center_sport_categories_sport_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54c349b125f8ed73f307485a19"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be5f702dc5221bdfbf806dddb"`);
        await queryRunner.query(`DROP TABLE "user_managers_list"`);
        await queryRunner.query(`DROP TABLE "sport_center_managers"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "field_schedule"`);
        await queryRunner.query(`DROP TYPE "public"."field_schedule_status_enum"`);
        await queryRunner.query(`DROP TABLE "sportcenter_schedules"`);
        await queryRunner.query(`DROP TYPE "public"."sportcenter_schedules_day_enum"`);
        await queryRunner.query(`DROP TABLE "payment_history"`);
        await queryRunner.query(`DROP TYPE "public"."payment_history_status_enum"`);
        await queryRunner.query(`ALTER TABLE "sport_center" RENAME COLUMN "mainManagerId" TO "managerId"`);
        await queryRunner.query(`ALTER TYPE "public"."field_price_enum" RENAME TO "field_status_enum"`);
        await queryRunner.query(`ALTER TABLE "field" RENAME COLUMN "price" TO "status"`);
        await queryRunner.query(`ALTER TABLE "sport_center" ADD CONSTRAINT "FK_17a47f80b38cc65592e7eaaadb1" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sport_category" ADD CONSTRAINT "FK_7aa8ad1f639edc765d2df07705f" FOREIGN KEY ("sportcenterId") REFERENCES "sport_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}