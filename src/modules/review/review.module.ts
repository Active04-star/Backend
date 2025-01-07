import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Review } from "src/entities/review.entity";
import { ReviewRepository } from "./review.repository";
import { UserRepository } from "../user/user.repository";
import { Reservation } from "src/entities/reservation.entity";
import { SportCenter } from "src/entities/sportcenter.entity";

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([User, Review, Reservation,SportCenter])],
    controllers: [ReviewController], 
    providers: [ReviewService, ReviewRepository, UserRepository], //reservationRepository,
    exports: []
})
export class ReviewModule {}