import { Injectable } from '@nestjs/common';
import { RatingRepository } from './rating.repository';
import { CreateRatingDto } from '../../dtos/rating/createRating.dto';


@Injectable()
export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async createRating(createRatingDto: CreateRatingDto) {

    const newRating = this.ratingRepository.create(createRatingDto);
    return this.ratingRepository.save(newRating);
  }

  async getRatingById(id: number) {
    return this.ratingRepository.findOne({
      where: { id },
    });
  }

  async getAverageRating(targetId: string, targetType: string) {  // Calcular el promedio de calificaciones

    const ratings = await this.ratingRepository.find({
      where: {
        sportCenter: { id: targetId },
      },
    });

    if (ratings.length === 0) {
      return 0; // De no aver calificaciones muestra un 0
    }

    const total = ratings.reduce((sum, rating) => sum + rating.value, 0);
    return total / ratings.length;
  }
}
