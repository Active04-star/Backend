import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { Review } from 'src/entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { reviewCreate } from 'src/dtos/review/review-create.dto';
import { reviewUpdate } from 'src/dtos/review/review-update.dto';
import { ReviewRepository } from './review.repository';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { Reservation } from 'src/entities/reservation.entity';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ApiResponse } from 'src/dtos/api-response';
import { SportCenterService } from '../sport-center/sport-center.service';

@Injectable()
export class ReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly userService: UserService,
        private readonly sportCenterService:SportCenterService,
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>
    ) { }

    //No es necesario traer todas las reseñas
    /**
     * Estadisticas de Admin
     */
    async getApiReviews(): Promise<number> {
        const founReviews: number = await this.reviewRepository.getApiReviews()
        return founReviews
    }

    async getReviewById(id: string): Promise<Review> {
        const founReviewsById: Review | undefined = await this.reviewRepository.getReviewsById(id)

        if (!founReviewsById) {
            throw new ApiError(ApiStatusEnum.REVIEWS_NOT_IN_CENTER, NotFoundException);
        }

        return founReviewsById
    }

    async getReviewsByField(id: string): Promise<Review[]> {
        const reviews = await this.reviewRepository.getReviewsByField(id)

        if (!reviews || reviews.length === 0) {
            throw new ApiError(ApiStatusEnum.REVIEWS_NOT_IN_CENTER, NotFoundException);
        }

        return reviews;
    }

    async createReview(data: reviewCreate): Promise<Review> {
        try {
            const { rating, comment, fieldId, userId ,sportCenterId} = data
            const user = await this.userService.getUserById(userId) //validacion 1. que el user exista

            const sportCenter=await this.sportCenterService.getById(sportCenterId)

            const foundReservation = await this.reservationRepository.findOne({ //validacion 2. que ese usuario tenga una reserva en estado COMPLETED en esa cancha, una vez que ya jugo en esa cancha
                where: {
                    user: { id: userId },
                    field: { id: fieldId },
                },
                relations: ['field', 'user'],
            });

            if (!foundReservation) {
                throw new ApiError(ApiStatusEnum.RESERVATION_NOT_FOUND, NotFoundException);
            }

            if(foundReservation.status!==ReservationStatus.COMPLETED){
                throw new ApiError(ApiStatusEnum.RESERVATION_NOT_COMPLETED, NotFoundException);
            }

            const review = await this.reservationRepository.findOne({   // validacion 3. que el usuario no tenga una review en esta cancha, evito duplicado
                where: {
                    user: { id: userId },
                    field: { id: fieldId }
                }
            });

            if (review) {
                throw new ApiError(ApiStatusEnum.FIELD_ALREADY_HAS_A_REVIEW, BadRequestException);
            }

            const createReview: Review | undefined = await this.reviewRepository.createReview({ //creo reseña
                rating,
                comment,
                user,
                field: foundReservation.field,
                reservation: foundReservation,
                sportcenter:sportCenter
            });

            if (createReview === undefined) {
                throw new ApiError(ApiStatusEnum.REVIEW_CREATION_FAILED, InternalServerErrorException);
            }

            await this.sportCenterService.updateAverageRating(sportCenter)

            return createReview;
        } catch (error) {
            throw new ApiError(error?.message, BadRequestException, error);
        }
    }

    async updateReview(id: string, reviewData: reviewUpdate): Promise<Review> {
        const review: Review = await this.reviewRepository.getReviewsById(id);
        if (!review) {
            throw new NotFoundException(`reseña con id: ${id} no encontrada`)
        }

        const updateReview = await this.reviewRepository.updateReview(review, reviewData);

        await this.sportCenterService.updateAverageRating(updateReview.sportcenter)

        
        return updateReview
    }

    async deleteReview(id: string, email: string): Promise<ApiResponse> {
        const user=await this.userService.getUserByMail(email)

        if (!user) {
            throw new ApiError(ApiStatusEnum.REVIEW_DELETION_FAILED, InternalServerErrorException);
        };

        //elimino reseña
        const review = await this.reviewRepository.getReviewsById(id);
        await this.reviewRepository.deleteReview(review);
        return { message: ApiStatusEnum.REVIEW_DELETION_SUCCESS };
    }

}