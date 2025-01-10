import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "src/entities/review.entity";
import { ReviewRepository } from "./review.repository";
import { Reservation } from "src/entities/reservation.entity";
import { SportCenter_Module } from "../sport-center/sport-center.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule,SportCenter_Module,TypeOrmModule.forFeature([ Review, Reservation])],
    controllers: [ReviewController], 
    providers: [ReviewService, ReviewRepository], //reservationRepository,
    exports: []
})
export class ReviewModule {}