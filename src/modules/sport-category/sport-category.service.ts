import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Sport_Category_Repository } from "./sport-category.repository";
import { SportCenterService } from "../sport-center/sport-center.service";
import { CreateSportCategoryDto } from "src/dtos/sportcategory/createSportCategory.dto";
import { SportCenter } from "src/entities/sportcenter.entity";
import { Sport_Category } from "src/entities/sport_category.entity";

@Injectable()
export class Sport_Category_Service{
    constructor(private readonly sportCategoryRepository:Sport_Category_Repository,private sportCenterService:SportCenterService){}

async createSportCategory(sportCenterId:string,data:CreateSportCategoryDto){
const sportCenter:SportCenter=await this.sportCenterService.findOne(sportCenterId)
const sportCategory:Sport_Category|undefined= await this.sportCategoryRepository.createSportCategory(sportCenter,data)
if(!sportCategory)
    throw new InternalServerErrorException('problema al crear la categoria')
return sportCategory
}


async filterSportCategories(page:number,limit:number){}



getSportCategories(){

}

    
}