import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportCategoryDto } from 'src/dtos/sportcategory/createSportCategory.dto';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Sport_Category_Repository {
  constructor(
    @InjectRepository(Sport_Category)
    private sportCategoryRepository: Repository<Sport_Category>,
  ) {}

  async createSportCategory(
    sportCenter: SportCenter,
    data: CreateSportCategoryDto,
  ): Promise<Sport_Category | undefined> {
    const saved_category: Sport_Category = await this.sportCategoryRepository.save(this.sportCategoryRepository.create({
        ...data,
        sportcenter: sportCenter,
       
      }),
      );
      return saved_category === null ? undefined : saved_category;
  }
}
