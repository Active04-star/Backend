import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Field_Block } from "src/entities/field_blocks.entity";
import { Field_Module } from "../field/field.module";
import { Field_Block_Service } from "./field_schedule.service";

@Module({
    imports: [forwardRef(() => Field_Module), TypeOrmModule.forFeature([Field_Block])],
    providers: [Field_Block_Service],
    exports: [Field_Block_Service],
})
export class Field_Block_Module { }