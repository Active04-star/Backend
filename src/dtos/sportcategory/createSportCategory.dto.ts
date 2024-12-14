import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateSportCategoryDto{
    @IsNotEmpty()
    @IsString()
    @Length(2,20)
    name: string;
  
    @IsOptional()
    @IsString()
    logo?: string; 
  
 


}