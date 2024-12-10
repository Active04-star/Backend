// src/modules/rating/rating.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { Rating } from '../../entities/rating.entity';

@EntityRepository(Rating)
export class RatingRepository extends Repository<Rating> {}
