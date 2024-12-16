import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import { CreateSportCategoryDto } from 'src/dtos/sportcategory/createSportCategory.dto';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { In, Repository } from 'typeorm';

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
    const saved_category: Sport_Category =
      this.sportCategoryRepository.create(data);

    saved_category.sportcenters.push(sportCenter);

    await this.sportCategoryRepository.save(saved_category);

    return saved_category === null ? undefined : saved_category;
  }

  async findById(sportCategoryId: string): Promise<Sport_Category | undefined> {
    const sportCategory: Sport_Category | null =
      await this.sportCategoryRepository.findOne({
        where: {
          id: sportCategoryId,
        },
        relations: {
          sportcenters: true,
        },
      });

    return sportCategory === null ? undefined : sportCategory;
  }

  async findByName(
    sportCategoryName: string,
  ): Promise<Sport_Category | undefined> {
    const sportCategory: Sport_Category | null =
      await this.sportCategoryRepository.findOne({
        where: {
          name: sportCategoryName,
        },
        relations: {
          sportcenters: true,
          field: true,
        },
      });

    return sportCategory === null ? undefined : sportCategory;
  }

  async filteredCategories(search?: string): Promise<Sport_Category[]> {
    const query = this.sportCategoryRepository
      .createQueryBuilder('sportCategory')
      .orderBy('sportCategory.name', 'ASC');

    if (search) {
      query.where('LOWER(sportCategory.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    const sportCategories = await query.getMany();
    return sportCategories;
  }

  async searchCategories(names: string[]): Promise<Sport_Category[]> {
    const categories: Sport_Category[] =
      await this.sportCategoryRepository.find({
        where: {
          name: In(names),
        },
      });

    return categories;
  }

  async deleteSportCategory(
    sportCategory: Sport_Category,
  ): Promise<Sport_Category | undefined> {
    const result: Sport_Category =
      await this.sportCategoryRepository.remove(sportCategory);
    if (isEmpty(result)) {
      return undefined;
    }

    return result;
  }
}
