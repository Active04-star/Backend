import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
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



@Injectable()
export class ReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly userService: UserService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>
    ){}

    async getReviews():Promise<Review[]>{ 
        const founReviews:Review[] = await this.reviewRepository.getReviews()

        if (founReviews.length === 0){
            throw new BadRequestException('Actualmente no hay reseñas')
        }

        return founReviews
    } 

    async getReviewById(id: string):Promise<Review>{ 
        const founReviewsById:Review | undefined = await this.reviewRepository.getReviewsById(id)

        if (!founReviewsById){
            throw new BadRequestException('La reseña que busca no existe')
        }

        return founReviewsById
    } 

    //deberia mandar el id de un sportcenter, no de una reseña
    async getReviewBySportcenter(id: string):Promise<Review[]>{ 
        const reviews = await this.reviewRepository.getReviewsBySportcenter(id)

        if (!reviews || reviews.length === 0){
            throw new BadRequestException('El complejo seleccionado no tiene reseñas')
        }

       return reviews;
    }

    async createReview(data: reviewCreate){
        const {rating, comment, fieldId, userId} = data
        const user = await this.userRepository.findOne({where: {id: userId}}) //validacion 1. que el user exista
        if (!user) {
            throw new NotFoundException('Usuario no encontrado.');
          }
          const foundReservation = await this.reservationRepository.findOne({ //validacion 2. que ese usuario tenga una reserva en estado ACTIVE en esa cancha
            where: { 
              user: { id: userId },
              field: { id: fieldId },
              status: ReservationStatus.ACTIVE,
            },
            relations: ['field', 'user'],
          });
        
        if (!foundReservation){
            throw new NotFoundException('haz una reserva para opinar')
        }
     //FALTA CREAR UN ENDPOINT DONDE ME TRAIGO TODAS LAS REVIEWS DE LA CANCHA Y CALCULO EL PROMEDIO
     //VER LOGICA DE LA OBTENCIO DE LAS RESEÑAS POOR CENTRO DEPORTIVO. CREO QUE ESTA MAL. DEBO TENER UN CAMPO MAS EN EL DTO QUE SEA SportCenter.id. y hacer algo similar que con canchas   
    //terminar. me traigo el registro del usuario especifico en esa cancha 
        const review = await this.reservationRepository.findOne({   // validacion 3. que el usuario no tenga una review en esta cancha, evito duplicado
            where: {
                user: {id: userId},
                field: {id: fieldId}
            }
        })

        if(review){
            throw new NotFoundException('Ya tienes una reseña en esta cancha')
        }

        const createReview: Review | undefined = await this.reviewRepository.createReview({ //creo reseña
            rating,
            comment,
            user,
            field: foundReservation.field,
            reservation: foundReservation,
        });

        if(createReview === undefined) {
            throw new HttpException(
                'problema de servidor',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        return createReview;
    }

    async updateReview(id: string, reviewData: reviewUpdate){
        const review = await this.reviewRepository.getReviewsById(id)
        if(!review){
            throw new NotFoundException(`reseña con id: ${id} no encontrada`)
        }

        const updateReview = await this.reviewRepository.updateReview(review, reviewData);
        return updateReview
    }

    async deleteReview(id: string, email:string){
        const user = await this.userRepository.findOne({
            where: {email},
            relations: ['user']
        });

        if (!user){
            throw new HttpException('usuario no encontrado', HttpStatus.NOT_FOUND)
        };

        //elimino reseña
        const review = await this.reviewRepository.getReviewsById(id)
        await this.reviewRepository.deleteReview(review)
        return `reseña con id ${id} eliminada correctamente`
    }

}