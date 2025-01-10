import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportCategoryDto } from 'src/dtos/sportcategory/createSportCategory.dto';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Sport_Category_Repository {

  constructor(
    @InjectRepository(Sport_Category) private categoryRepository: Repository<Sport_Category>
  ) { }


  async createSportCategory(data: CreateSportCategoryDto): Promise<Sport_Category | undefined> {

    const saved_category: Sport_Category = this.categoryRepository.create(data);

    await this.categoryRepository.save(saved_category);

    return saved_category === null ? undefined : saved_category;
  }


  async findById(sportCategoryId: string): Promise<Sport_Category | undefined> {
    const sportCategory: Sport_Category | null = await this.categoryRepository.findOne({
      where: { id: sportCategoryId },
    });

    return sportCategory === null ? undefined : sportCategory;
  }


  async findByName(sportCategoryName: string): Promise<Sport_Category | undefined> {
    const sportCategory: Sport_Category | null = await this.categoryRepository.findOne({
      where: {
        name: sportCategoryName
      }
    });

    return sportCategory === null ? undefined : sportCategory;
  }


  async filteredCategories(keyword?: string): Promise<Sport_Category[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('sport_category')
      .orderBy('sport_category.name', 'DESC', 'NULLS LAST');

    if (keyword) {
      queryBuilder.andWhere('(sport_category.name LIKE :keyword)', { keyword: `%${keyword}%` });
    }

    const categories: Sport_Category[] = await queryBuilder.getMany();

    return categories;

  }


  // async deleteSportCategory(sportCategory: Sport_Category): Promise<Sport_Category | undefined> {
  //   const result: Sport_Category = await this.sportCategoryRepository.remove(sportCategory);
  //   if (isEmpty(result)) {
  //     return undefined;
  //   }

  //   return result;
  // }
}
