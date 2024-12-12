import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Field } from "src/entities/field.entity";
import { Repository } from "typeorm";

@Injectable()
export class Field_Repository{
    constructor(
        @InjectRepository(Field)
        private sportCategoryRepository:Repository<Field>){}















        
}