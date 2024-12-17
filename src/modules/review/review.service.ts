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

@Injectable()
export class ReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly userService: UserService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
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

    //deberia mandar el id de un sportcenter, no de una reseña
    async getReviewBySportcenter(id: string): Promise<Review[]> {
        const reviews = await this.reviewRepository.getReviewsBySportcenter(id)

        if (!reviews || reviews.length === 0) {
            throw new ApiError(ApiStatusEnum.REVIEWS_NOT_IN_CENTER, NotFoundException);
        }

        return reviews;
    }

    async createReview(data: reviewCreate): Promise<Review> {
        try {
            const { rating, comment, fieldId, userId } = data
            const user = await this.userRepository.findOne({ where: { id: userId } }) //validacion 1. que el user exista

            if (!user) {
                throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
            }

            const foundReservation = await this.reservationRepository.findOne({ //validacion 2. que ese usuario tenga una reserva en estado ACTIVE en esa cancha
                where: {
                    user: { id: userId },
                    field: { id: fieldId },
                    status: ReservationStatus.ACTIVE,
                },
                relations: ['field', 'user'],
            });

            if (!foundReservation) {
                throw new ApiError(ApiStatusEnum.RESERVATION_NOT_FOUND, NotFoundException);
            }

            const createReview: Review | undefined = await this.reviewRepository.createReview({ //creo reseña
                rating,
                comment,
                user,
                field: foundReservation.field,
                reservation: foundReservation,
            });

            if (createReview === undefined) {
                throw new ApiError(ApiStatusEnum.REVIEW_CREATION_FAILED, InternalServerErrorException);
            }

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
        return updateReview
    }

    async deleteReview(id: string, email: string): Promise<ApiResponse> {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['user']
        });

        if (!user) {
            throw new ApiError(ApiStatusEnum.REVIEW_DELETION_FAILED, InternalServerErrorException);
        };

        //elimino reseña
        const review = await this.reviewRepository.getReviewsById(id);
        await this.reviewRepository.deleteReview(review);
        return { message: ApiStatusEnum.REVIEW_DELETION_SUCCESS };
    }

}