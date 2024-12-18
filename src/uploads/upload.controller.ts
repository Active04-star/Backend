import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('upload')
@Controller('upload')
export class UploadController {

  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image')) // 'image' debe coincidir con el nombre del campo en el frontend
  @ApiOperation({ summary: 'poder subir imagenes ' })
  @ApiConsumes('multipart/form-data') // Indica que la ruta consume archivos de tipo 'multipart/form-data'
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    const url = await this.uploadService.uploadToCloudinary(file);
    return { url };
  }
}
