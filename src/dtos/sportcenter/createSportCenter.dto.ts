import { Type } from '@nestjs/class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { CreateSportCategoryDto } from '../sportcategory/createSportCategory.dto';
import { CreatePhotoDto } from '../photos/createPhotos.dto';

export class CreateSportCenterDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  name: string;

  @IsNotEmpty()
  @Length(5, 30)
  address: string;

  @IsUUID() 
  @IsNotEmpty()
  manager: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSportCategoryDto)
  @IsOptional()
  sport_category?: CreateSportCategoryDto[];

  @ValidateNested({ each: true })
  @Type(() => CreatePhotoDto)
  @IsOptional()
  photos?: CreatePhotoDto[];

}
