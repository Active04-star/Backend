import { Put, UseInterceptors, Param, ParseUUIDPipe, UploadedFiles, Controller, UploadedFile } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiParam, ApiBody, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "src/dtos/api-response";
import { UploadImagesDto } from "src/dtos/sportcenter/upload-images.dto";
import { ImagesService } from "./images.service";

@ApiTags("Images - Upload")
@Controller("upload")
export class ImagesController {

    constructor(private readonly imagesService: ImagesService) { }

    @Put("sport-center/:id")
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images', 5))
    // @ApiBearerAuth()
    //   @Roles(UserRole.MANAGER)
    //   @UseGuards(AuthGuard)
    @ApiParam({ name: "id", description: "ID del centro deportivo al que se va a insertar la imagen" })
    @ApiBody({ description: 'Imagenes a insertar en el centro deportivo, Nota: Debe ser un array de imagenes entre 1 - 5 elementos', type: UploadImagesDto })
    async uploadToCenter(@Param('id', ParseUUIDPipe) id: string, @UploadedFiles() files: Array<Express.Multer.File>): Promise<ApiResponse> {
        return await this.imagesService.uploadImages(id, files);
    }


    @Put("field/:id")
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    // @ApiBearerAuth()
    //   @Roles(UserRole.MANAGER)
    //   @UseGuards(AuthGuard)
    @ApiParam({ name: "id", description: "ID de la cancha a la que se va a insertar la imagen" })
    @ApiBody({
        description: 'Imagen a insertar en el centro deportivo, Nota: Una imagen por cancha',
        schema: {
            type: 'object',
            properties: {
                image: {
                    nullable: false,
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadToField(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse> {
        return await this.imagesService.insertImageToField(id, file);
    }


    @Put("user/:id")
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    // @ApiBearerAuth()
    //   @Roles(UserRole.MANAGER)
    //   @UseGuards(AuthGuard)
    @ApiParam({ name: "id", description: "ID del usuario al que se va a insertar la imagen" })
    @ApiBody({
        description: 'Imagen a insertar, Nota: Una imagen por usuario',
        schema: {
            type: 'object',
            properties: {
                image: {
                    nullable: false,
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadToUser(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse> {
        return await this.imagesService.uploadToUser(id, file);
    }
}