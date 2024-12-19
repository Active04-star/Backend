import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "src/entities/image.entity";
import { SportCenter } from "src/entities/sportcenter.entity";
import { Repository } from "typeorm";

@Injectable()
export class ImagesRepository {

    constructor(@InjectRepository(Image) private readonly imagesRepository: Repository<Image>) { }

    async insertImageToCenter(sport_center: SportCenter, url: string): Promise<Image> {
        const image: Image = this.imagesRepository.create({ sportcenter: sport_center, image_url: url });
        return await this.imagesRepository.save(image);
    }

    // async insertImageToField(field: Field, url: string): Promise<Image> {
    //     const image: Image = this.imagesRepository.create({ field: field, image_url: url });
    //     return await this.imagesRepository.save(image);
    // }

    async updateFieldImage(imageInstance: Image, url: string): Promise<Image> {
        imageInstance.image_url = url;
        return await this.imagesRepository.save(imageInstance);
    }

    async getByUrl(url: any): Promise<Image | undefined> {
        const found_image: Image | null = await this.imagesRepository.findOne({ where: { image_url: url } });
        return found_image ? found_image : undefined;
    }

    async deleteImage(imageInstance: Image): Promise<Image> {
        const deleted_image: Image = await this.imagesRepository.remove(imageInstance);
        return deleted_image;
    }
}