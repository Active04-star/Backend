import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ImagesRepository } from "./images.repository";
import { Image } from "src/entities/image.entity";
import { SportCenter } from "src/entities/sportcenter.entity";
import { ApiError } from "src/helpers/api-error-class";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { Field } from "src/entities/field.entity";

@Injectable()
export class ImagesService {

    constructor(private readonly imagesRepository: ImagesRepository) { }

    async insertImageToCenter(sport_center: SportCenter, url: string): Promise<Image> {
        const inserted: Image | undefined = await this.imagesRepository.insertImageToCenter(sport_center, url);

        if (inserted === undefined) {
            throw new ApiError(ApiStatusEnum.IMAGE_CREATION_FAILED, InternalServerErrorException,
                ApiStatusEnum.IMAGE_INSERTION_FAIL + ` [${url}] en el centro deportivo`);
        }
        return inserted;
    }

    async insertImageToField(field: Field, url: string): Promise<Image> {
        const inserted: Image | undefined = await this.imagesRepository.insertImageToField(field, url);

        if (inserted === undefined) {
            throw new ApiError(ApiStatusEnum.IMAGE_CREATION_FAILED, InternalServerErrorException,
                ApiStatusEnum.IMAGE_INSERTION_FAIL + ` [${url}] en la cancha`);
        }
        return inserted;
    }
}