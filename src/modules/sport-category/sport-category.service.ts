import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Sport_Category_Repository } from './sport-category.repository';
import { CreateSportCategoryDto } from 'src/dtos/sportcategory/createSportCategory.dto';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';

@Injectable()
export class Sport_Category_Service {

  constructor(
    private readonly categoryRepository: Sport_Category_Repository,
  ) { }


  async createSportCategory(data: CreateSportCategoryDto): Promise<Sport_Category> {

    try {
      const repeatedName = await this.categoryRepository.findByName(data.name);

      if (repeatedName)
        throw new ApiError(ApiStatusEnum.CATEGORY_ALREADY_EXISTS, BadRequestException);

      const sportCategory: Sport_Category | undefined = await this.categoryRepository.createSportCategory(data);

      if (!sportCategory)
        throw new ApiError(ApiStatusEnum.CATEGORY_CREATION_FAILED, InternalServerErrorException);

      return sportCategory;

    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error);

    }
  }


  async findById(sportCategoryId: string): Promise<Sport_Category> {
    const sportCategory: Sport_Category | undefined = await this.categoryRepository.findById(sportCategoryId);

    if (sportCategory === undefined) {
      throw new ApiError(ApiStatusEnum.CATEGORY_NOT_FOUND, NotFoundException);
    }

    return sportCategory;
  }


  async filterSportCategories(search?: string) {
    const sportCategories: Sport_Category[] = await this.categoryRepository.filteredCategories(search);

    if (sportCategories.length === 0) {
      throw new ApiError(ApiStatusEnum.CATEGORY_NOT_FOUND, NotFoundException);
    }

    return sportCategories;
  }

  // async deleteSportCategory(id: string) {
  //   const found_sport: Sport_Category = await this.findById(id);
  //   const was_deleted: Sport_Category = await this.sportCategoryRepository.deleteSportCategory(found_sport);

  //   if (!was_deleted) {
  //     throw { error: "Something went wrong" };
  //   }

  //   return { message: `Deporte eliminado correctamente` };
  // }
}
