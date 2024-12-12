import { Injectable } from "@nestjs/common";
import { Sport_Category_Repository } from "./sport-category.repository";

@Injectable()
export class Sport_Category_Service{
    constructor(private readonly sportCategoryRepository:Sport_Category_Repository){}



    
}