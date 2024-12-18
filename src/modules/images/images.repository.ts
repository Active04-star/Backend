import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Field } from "src/entities/field.entity";
import { Image } from "src/entities/image.entity";
import { SportCenter } from "src/entities/sportcenter.entity";
import { Repository } from "typeorm";

@Injectable()
export class ImagesRepository {

    constructor(@InjectRepository(Image) private readonly imagesRepository: Repository<Image>) { }

    async insertImageToCenter(sport_center: SportCenter, url: string): Promise<Image> {
        const image: Image = this.imagesRepository.create({sportcenter: sport_center, image_url: url});
        return await this.imagesRepository.save(image);
    }

    async insertImageToField(field: Field, url: string): Promise<Image> {
        const image: Image = this.imagesRepository.create({field: field, image_url: url});
        return await this.imagesRepository.save(image);
    }
}