import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { reviewUpdate } from 'src/dtos/review/review-update.dto';
import { Review } from 'src/entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewRepository {
    constructor(@InjectRepository(Review) private reviewRepository: Repository<Review>) { }

    //No es necesario traer todas las reseñas
    /**
     * Estadisticas de Admin
     */
    async getApiReviews(): Promise<number> {
        return await this.reviewRepository.count()
    }

    async getReviewsById(id: string): Promise<Review | undefined> {
        const foundReview = await this.reviewRepository.createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .leftJoinAndSelect('review.sportcenter', 'sportcenter')
            .leftJoinAndSelect('review.reservation', 'reservation') 
            .where('review.id = :id', { id })
            .getOne();

        return foundReview === null ? undefined : foundReview;
    }

    async getReviewsBySportcenter(id: string): Promise<Review[]> {
        const reviews = await this.reviewRepository.createQueryBuilder('review')
            .leftJoinAndSelect('review.sportcenter', 'sportcenter')
            .leftJoinAndSelect('review.user', 'user')
            .where('sportcenter.id = :id', { id: id })
            .getMany();

        if (reviews.length === 0) {
            throw new NotFoundException(`No se encontraron reseñas para el centro deportivo con id: ${id}`);
        }

        return reviews;
    }
    async createReview(reviewData: Partial<Review>): Promise<Review | undefined> {
        const review = this.reviewRepository.create(reviewData);
        return this.reviewRepository.save(review)
    }

    async updateReview(review: Review, reviewData: reviewUpdate): Promise<Review> {
        review.rating = reviewData.rating ?? review.rating;
        review.comment = reviewData.comment ?? review.comment;

        review.isEdited = true;
        review.updatedAt = new Date();

        return this.reviewRepository.save(review)
    }

    async deleteReview(review: Review): Promise<void> {
        await this.reviewRepository.remove(review)
    }

}