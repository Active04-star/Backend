import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsString()
  url: string; 

  @IsNotEmpty()
  @IsUUID()
  sportCenterId: string; 
}
