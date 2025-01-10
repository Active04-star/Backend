import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { reviewUpdate } from 'src/dtos/review/review-update.dto';
import { Review } from 'src/entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  //No es necesario traer todas las reseñas
  /**
   * Estadisticas de Admin
   */
  async getApiReviews(): Promise<number> {
    return await this.reviewRepository.count();
  }

  async getReviewsById(id: string): Promise<Review | undefined> {
    const foundReview = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.sportcenter', 'sportcenter')
      .leftJoinAndSelect('review.reservation', 'reservation')
      .where('review.id = :id', { id })
      .getOne();

    return foundReview === null ? undefined : foundReview;
  }

  async getReviewsByField(id: string): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.field', 'field')
      .leftJoinAndSelect('review.user', 'user')
      .where('field.id = :id', { id: id })
      .getMany();
  }

  async createReview(reviewData: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviewRepository.create(reviewData);
    return this.reviewRepository.save(review);
  }

  async updateReview(
    review: Review,
    reviewData: reviewUpdate,
  ): Promise<Review> {
    review.rating = reviewData.rating ?? review.rating;
    review.comment = reviewData.comment ?? review.comment;
    return this.reviewRepository.save(review);
  }

  async deleteReview(review: Review): Promise<void> {
    await this.reviewRepository.remove(review);
  }
}
