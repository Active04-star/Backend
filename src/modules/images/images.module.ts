import { forwardRef, Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesRepository } from "./images.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "src/entities/image.entity";
import { ImagesController } from "./images.controller";
import { UploadModule } from "src/modules/uploads/upload.module";
import { Sport_Center_Module } from "../sport-center/sport-center.module";
import { Field_Module } from "../field/field.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UploadModule, UserModule, forwardRef(() => Sport_Center_Module), Field_Module, TypeOrmModule.forFeature([Image])],
    controllers: [ImagesController],
    providers: [ImagesService, ImagesRepository],
    exports: [ImagesService]
})
export class ImagesModule { }