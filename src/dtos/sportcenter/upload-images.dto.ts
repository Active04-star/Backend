import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, IsOptional } from "class-validator";

export class UploadImagesDto {
    @ApiProperty({
        description: 'Imagenes Max. 5 (Debe ser un Array de Array buffer)',
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
          maximum: 5,
        },
      })
      @ArrayMaxSize(5)
      @IsOptional()
      images: any[];
}