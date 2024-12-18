import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ImagesRepository } from "./images.repository";
import { Image } from "src/entities/image.entity";
import { SportCenter } from "src/entities/sportcenter.entity";
import { ApiError } from "src/helpers/api-error-class";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { Field } from "src/entities/field.entity";
import { UploadService } from "src/modules/uploads/upload.service";
import { arrayNotEmpty, isNotEmpty } from "class-validator";
import { ApiResponse } from "src/dtos/api-response";
import { SportCenterService } from "../sport-center/sport-center.service";
import { Field_Service } from "../field/field.service";
import { UserService } from "../user/user.service";
import { User } from "src/entities/user.entity";

@Injectable()
export class ImagesService {

    public static CENTER_IMAGES_LIMIT: number = 3;

    constructor(private readonly imagesRepository: ImagesRepository,
        private readonly uploadService: UploadService,
        private readonly sportCenterService: SportCenterService,
        private readonly fieldService: Field_Service,
        private readonly userService: UserService,
    ) { }

    async uploadImages(id: string, files: Array<Express.Multer.File>): Promise<ApiResponse> {

        try {
            const found_center: SportCenter = await this.sportCenterService.getById(id);

            if (!isNotEmpty(found_center.photos) || found_center.photos.length + files.length <= ImagesService.CENTER_IMAGES_LIMIT ) {

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
            }

            throw new ApiError(ApiStatusEnum.MAX_IMAGES_REACHED, BadRequestException);

        } catch (error) {
            throw new HttpException(error?.message, error?.status || 500);

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

            if (found_field.photos.length <= 1) {
                const outdated_image: Image | undefined = await this.getByUrl(found_field.photos[0].image_url);

                if (outdated_image === undefined) {
                    throw new ApiError(ApiStatusEnum.IMAGE_NOT_FOUND, NotFoundException);
                }

                // const inserted: Image | undefined = await this.imagesRepository.insertImageToField(found_field, url);
                const updated_image: Image = await this.imagesRepository.updateFieldImage(outdated_image, url);

                if (updated_image === undefined) {
                    throw new ApiError(ApiStatusEnum.IMAGE_CREATION_FAILED, InternalServerErrorException,
                        ApiStatusEnum.IMAGE_INSERTION_FAIL + ` [${url}] en la cancha (${found_field.number})`);
                }

                await this.uploadService.removeFromCloudinary(outdated_image.image_url);

                return { message: ApiStatusEnum.IMAGE_TOCENTER_UPLOAD_SUCCESS };
            }

            throw new ApiError(ApiStatusEnum.MAX_IMAGES_REACHED, BadRequestException);

        } catch (error) {
            throw new HttpException(error?.message, error?.status || 500);

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

            return { message: ApiStatusEnum.IMAGE_PROFILE_UPLOAD_SUCCESS, url: url };

        } catch (error) {
            throw new HttpException(error?.message, error?.status || 500);

        }
    }


    async deleteImage(url: string): Promise<ApiResponse> {
        try {

            const found_image: Image | undefined = await this.getByUrl(url);

            if (found_image !== undefined) {
                const deleted_image: Image = await this.imagesRepository.deleteImage(found_image);

                if (!deleted_image) {
                    throw new ApiError(ApiStatusEnum.IMAGE_DELETION_FAILED, InternalServerErrorException);
                }

            }

            await this.uploadService.removeFromCloudinary(url);

            return { message: ApiStatusEnum.IMAGE_DELETION_SUCCESS };

        } catch (error) {
            throw new HttpException(error?.message, error?.status || 500);

        }
    }


    async getByUrl(url: string): Promise<Image | undefined> {
        const found_image: Image | undefined = await this.imagesRepository.getByUrl(url);

        return found_image;
    }

}