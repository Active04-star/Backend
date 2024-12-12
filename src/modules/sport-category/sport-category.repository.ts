import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sport_Category } from "src/entities/sport_category.entity";
import { Repository } from "typeorm";

@Injectable()
export class Sport_Category_Repository{
    constructor(
        @InjectRepository(Sport_Category)
        private sportCategoryRepository:Repository<Sport_Category>){}















        
}