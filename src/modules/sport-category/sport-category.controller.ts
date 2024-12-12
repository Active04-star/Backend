import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Sport_Category_Service } from "./sport-category.service";

@ApiTags('Sport Categories')
@Controller('sportCategories')
export class Sport_Category_Controller{
    constructor(private readonly sport_category_service:Sport_Category_Service){}



}