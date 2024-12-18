import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ImagesRepository } from "./images.repository";
import { Image } from "src/entities/image.entity";
import { SportCenter } from "src/entities/sportcenter.entity";
import { ApiError } from "src/helpers/api-error-class";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { Field } from "src/entities/field.entity";
import { UploadService } from "src/uploads/upload.service";
import { arrayNotEmpty } from "class-validator";
import { ApiResponse } from "src/dtos/api-response";
import { SportCenterService } from "../sport-center/sport-center.service";
import { Field_Service } from "../field/field.service";
import { UserService } from "../user/user.service";
import { User } from "src/entities/user.entity";

@Injectable()
export class ImagesService {

    constructor(private readonly imagesRepository: ImagesRepository,
        private readonly uploadService: UploadService,
        private readonly sportCenterService: SportCenterService,
        private readonly fieldService: Field_Service,
        private readonly userService: UserService,
    ) { }


    async uploadImages(id: string, files: Array<Express.Multer.File>): Promise<ApiResponse> {

        try {
            const found_center: SportCenter = await this.sportCenterService.getById(id);

            if (arrayNotEmpty(files)) {

                const images_urls: string[] = await Promise.all(
                    files.map(async (file) => {
                        const url: string = await this.uploadService.uploadToCloudinary(file);

                        return url;
                    })
                );

                await Promise.all(
                    images_urls.map(async (url) => {
                        return await this.insertImageToCenter(found_center, url);
                    })
                );

            } else {
                throw new ApiError(ApiStatusEnum.NO_IMAGES_IN_REQUEST, BadRequestException);

            }

            return { message: ApiStatusEnum.IMAGE_TOCENTER_UPLOAD_SUCCESS };

        } catch (error) {
            throw new ApiError(error?.message, InternalServerErrorException, error);

        }

    }

    
    async insertImageToCenter(sport_center: SportCenter, url: string): Promise<Image> {
        const inserted: Image | undefined = await this.imagesRepository.insertImageToCenter(sport_center, url);

        if (inserted === undefined) {
            throw new ApiError(ApiStatusEnum.IMAGE_CREATION_FAILED, InternalServerErrorException,
                ApiStatusEnum.IMAGE_INSERTION_FAIL + ` [${url}] en el centro deportivo (${sport_center.name})`);
        }
        return inserted;
    }


    async insertImageToField(id: string, file: Express.Multer.File): Promise<ApiResponse> {
        try {

            const url: string = await this.uploadService.uploadToCloudinary(file);

            const found_field: Field = await this.fieldService.findById(id);
            const inserted: Image | undefined = await this.imagesRepository.insertImageToField(found_field, url);

            if (inserted === undefined) {
                throw new ApiError(ApiStatusEnum.IMAGE_CREATION_FAILED, InternalServerErrorException,
                    ApiStatusEnum.IMAGE_INSERTION_FAIL + ` [${url}] en la cancha (${found_field.number})`);
            }

            return { message: ApiStatusEnum.IMAGE_TOCENTER_UPLOAD_SUCCESS };
        } catch (error) {
            throw new ApiError(error?.message, InternalServerErrorException, error);

        }
    }


    async uploadToUser(id: string, file: Express.Multer.File): Promise<{ message: ApiStatusEnum, url: string }> {
        try {

            const url: string = await this.uploadService.uploadToCloudinary(file);

            const found_user: User = await this.userService.getUserById(id);

            await this.userService.updateUser(id, { profile_image: url });

            if (found_user.profile_image !== 'https://res.cloudinary.com/dvgvcleky/image/upload/f_auto,q_auto/v1/RestO/ffgx6ywlaix0mb3jghux') {
                await this.uploadService.removeFromCloudinary(found_user.profile_image);

            }

            return { message: ApiStatusEnum.IMAGE_TOCENTER_UPLOAD_SUCCESS, url: url };

        } catch (error) {
            throw new ApiError(error?.message, InternalServerErrorException, error);

        }
    }

}