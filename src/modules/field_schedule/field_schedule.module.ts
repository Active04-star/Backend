
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Field_Schedule } from "src/entities/field_schedule.entity";
import { Field_Schedule_Service } from "./field_schedule.service";
import { Field_Schedule_Controller } from "./field_schedule.controller";
import { Field_Block } from "src/entities/field_blocks.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Field_Schedule,Field_Block])],
    controllers: [Field_Schedule_Controller],
    providers: [Field_Schedule_Service],
    exports: [],
})
export class Field_Schedule_Module { }