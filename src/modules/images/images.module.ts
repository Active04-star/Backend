import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesRepository } from "./images.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "src/entities/image.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Image])],
    providers: [ImagesService, ImagesRepository],
    exports: [ImagesService]
})
export class ImagesModule { }