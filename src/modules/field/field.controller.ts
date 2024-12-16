import { Body, Controller, Delete, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Field_Service } from "./field.service";
import { FieldDto } from "src/dtos/field/createField.dto";

@ApiTags('Field')
@Controller('field')
export class Field_Controller{
    constructor(private readonly fieldService:Field_Service){}

@Post()
async createField(@Body() fieldData:FieldDto){
return await this.fieldService.createField(fieldData)
}


@Delete(':id')
async deleteField(){
    
}
}