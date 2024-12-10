import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateSportCenterDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @Length(5, 120)
  address: string;

  @IsUUID() 
  @IsNotEmpty()
  manager: string;

  // @ValidateNested({ each: true })
  // @Type(() => CreateSportCategoryDto)
  // @IsOptional()
  // sport_category?: CreateSportCategoryDto[];

  // @ValidateNested({ each: true })
  // @Type(() => CreatePhotoDto)
  // @IsOptional()
  // photos?: CreatePhotoDto[];

}
