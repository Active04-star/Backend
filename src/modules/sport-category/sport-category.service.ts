import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Sport_Category_Repository } from './sport-category.repository';
import { SportCenterService } from '../sport-center/sport-center.service';
import { CreateSportCategoryDto } from 'src/dtos/sportcategory/createSportCategory.dto';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { Sport_Category } from 'src/entities/sport_category.entity';

@Injectable()
export class Sport_Category_Service {
  constructor(
    private readonly sportCategoryRepository: Sport_Category_Repository,
    @Inject(forwardRef(() => SportCenterService))
    private sportCenterService: SportCenterService,
  ) {}

  async createSportCategory(
    sportCenterId: string,
    data: CreateSportCategoryDto,
  ) {
    const sportCenter: SportCenter =
      await this.sportCenterService.findOne(sportCenterId);
    const repeatedName = await this.sportCategoryRepository.findByName(
      data.name,
    );
    if (!repeatedName)
      throw new BadRequestException('ya existe un deporte con ese nombre');
    const sportCategory: Sport_Category | undefined =
      await this.sportCategoryRepository.createSportCategory(sportCenter, data);
    if (!sportCategory)
      throw new InternalServerErrorException('problema al crear la categoria');
    return sportCategory;
  }

  async findById(sportCategoryId: string): Promise<Sport_Category> {
    const sportCategory: Sport_Category | undefined =
      await this.sportCategoryRepository.findById(sportCategoryId);

    if (sportCategory === undefined) {
      throw new NotFoundException('No se encontro un deporte con ese id');
    }

    return sportCategory;
  }

  async filterSportCategories(search?: string) {
    const sportCategories: Sport_Category[] =
      await this.sportCategoryRepository.filteredCategories(search);

    if (sportCategories.length === 0) {
      throw new BadRequestException('no existe ningun centro deportivo');
    }

    return sportCategories;
  }

  async searchCategories(names: string[]) {
    const categories =
      await this.sportCategoryRepository.searchCategories(names);
    if (categories.length === 0) {
      throw new InternalServerErrorException(
        'Ocurrio un error buscando deportes ',
      );
    }
    return categories;
  }

  async deleteSportCategorie(id:string){

  }
}
