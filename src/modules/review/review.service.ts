import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
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
  import { SportCenter } from 'src/entities/sportcenter.entity';
  
  @Injectable()
  export class ReviewService {
    constructor(
      private readonly reviewRepository: ReviewRepository,
      @InjectRepository(User)
      private userRepository: Repository<User>,
      @InjectRepository(Reservation)
      private reservationRepository: Repository<Reservation>,
      @InjectRepository(SportCenter)
      private sportCenterRepository: Repository<SportCenter>,
      @InjectRepository(Review) private review_Repository: Repository<Review>,
    ) {}
  
    //No es necesario traer todas las reseñas
    /**
     * Estadisticas de Admin
     */
    async getApiReviews(): Promise<number> {
      const founReviews: number = await this.reviewRepository.getApiReviews();
      return founReviews;
    }
  
    async getReviewById(id: string): Promise<Review> {
      const founReviewsById: Review | undefined =
        await this.reviewRepository.getReviewsById(id);
  
      if (!founReviewsById) {
        throw new ApiError(
          ApiStatusEnum.REVIEWS_NOT_IN_CENTER,
          NotFoundException,
        );
      }
  
      return founReviewsById;
    }
  
    async getReviewsByField(id: string): Promise<Review[]> {
      return await this.reviewRepository.getReviewsByField(id);
    }
  
    async createReview(data: reviewCreate): Promise<Review> {
      try {
        const { rating, comment, fieldId, userId } = data;
        const user = await this.userRepository.findOne({ where: { id: userId } }); //validacion 1. que el user exista
  
        if (!user) {
          throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
        }
  
        const foundReservation = await this.reservationRepository.findOne({
          //validacion 2. UNA VEZ QUE EL USUARIO TEMRINA LA RESERVA VA A PODER CREAR UNA RESEÑA
          where: {
            user: { id: userId },
            field: { id: fieldId },
            status: ReservationStatus.COMPLETED,
          },
          relations: ['field', 'user'],
        });
  
        if (!foundReservation) {
          throw new ApiError(
            ApiStatusEnum.RESERVATION_NOT_FOUND,
            NotFoundException,
          );
        }
  
        const review = await this.reservationRepository.findOne({
          // validacion 3. que el usuario no tenga una review en esta cancha, evito duplicado
          where: {
            user: { id: userId },
            field: { id: fieldId },
          },
        });
  
        if (review) {
          throw new ApiError(
            ApiStatusEnum.FIELD_ALREADY_HAS_A_REVIEW,
            BadRequestException,
          );
        }
  
        const createReview: Review | undefined =
          await this.reviewRepository.createReview({
            //creo reseña
            rating,
            comment,
            user,
            field: foundReservation.field,
            reservation: foundReservation,
            sportcenter: foundReservation.field.sportcenter,
          });
  
        if (createReview === undefined) {
          throw new ApiError(
            ApiStatusEnum.REVIEW_CREATION_FAILED,
            InternalServerErrorException,
          );
        }
        if (createReview.sportcenter) {
          await this.updateSportCenterRating(createReview.sportcenter.id);
        }
  
        return createReview;
      } catch (error) {
        throw new ApiError(error?.message, BadRequestException, error);
      }
    }
  
    async updateSportCenterRating(sportCenterId: string) {
      const reviews = await this.review_Repository.find({
        where: { sportcenter: { id: sportCenterId } },
      });
  
      const average =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length || 0;
  
      await this.sportCenterRepository.update(sportCenterId, {
        averageRating: parseFloat(average.toFixed(2)),
      });
    }
  
    async updateReview(id: string, reviewData: reviewUpdate): Promise<Review> {
      const review: Review = await this.reviewRepository.getReviewsById(id);
      if (!review) {
        throw new NotFoundException(`reseña con id: ${id} no encontrada`);
      }
  
      const updateReview = await this.reviewRepository.updateReview(
        review,
        reviewData,
      );
      return updateReview;
    }
  
    async deleteReview(id: string, email: string): Promise<ApiResponse> {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['user'],
      });
  
      if (!user) {
        throw new ApiError(
          ApiStatusEnum.REVIEW_DELETION_FAILED,
          InternalServerErrorException,
        );
      }
  
      //elimino reseña
      const review = await this.reviewRepository.getReviewsById(id);
      await this.reviewRepository.deleteReview(review);
      return { message: ApiStatusEnum.REVIEW_DELETION_SUCCESS };
    }
  }