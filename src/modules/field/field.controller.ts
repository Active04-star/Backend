import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Field_Service } from "./field.service";

@ApiTags('Field')
@Controller('field')
export class Field_Controller{
    constructor(private readonly fieldService:Field_Service){}



}