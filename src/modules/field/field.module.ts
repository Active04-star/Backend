import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Field } from "src/entities/field.entity";
import { Field_Controller } from "./field.controller";
import { Field_Service } from "./field.service";
import { Field_Repository } from "./field.repository";

@Module({
    imports:[TypeOrmModule.forFeature([Field])],
    controllers:[Field_Controller],
    providers:[Field_Service,Field_Repository],
    exports:[],
})
export class Field_Module{}