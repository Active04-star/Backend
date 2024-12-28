import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Field } from "src/entities/field.entity";
import { Field_Controller } from "./field.controller";
import { Field_Service } from "./field.service";
import { Field_Repository } from "./field.repository";
import { SportCenter_Module } from "../sport-center/sport-center.module";
import { Sport_Cateogry_Module } from "../sport-category/sport-category.module";
import { Reservation } from "src/entities/reservation.entity";

@Module({
    imports: [Sport_Cateogry_Module, forwardRef(() => SportCenter_Module), TypeOrmModule.forFeature([Field, Reservation])],
    controllers: [Field_Controller],
    providers: [Field_Service, Field_Repository],
    exports: [Field_Service],
})
export class Field_Module { }