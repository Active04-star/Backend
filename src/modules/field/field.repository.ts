import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FieldDto } from "src/dtos/field/createField.dto";
import { Field } from "src/entities/field.entity";
import { Sport_Category } from "src/entities/sport_category.entity";
import { SportCenter } from "src/entities/sportcenter.entity";
import { Repository } from "typeorm";

@Injectable()
export class Field_Repository{
    
    constructor(
        @InjectRepository(Field)
        private fieldRepository:Repository<Field>){}


        async createSportCenter(sportCenter: SportCenter,
             fieldData: FieldDto): Promise<Field|undefined> {
            const saved_field:Field=await this.fieldRepository.save(this.fieldRepository.create({
                ...fieldData,
                sportcenter:sportCenter
            }))

            return saved_field === null ? undefined : saved_field;

        }














        
}