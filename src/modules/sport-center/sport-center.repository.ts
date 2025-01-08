import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { SportCenterList } from 'src/dtos/sportcenter/sport-center-list.dto';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
import { Image } from 'src/entities/image.entity';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { User } from 'src/entities/user.entity';
import { Sport_Center_Status } from 'src/enums/sport_Center_Status.enum';
import { In, Repository } from 'typeorm';

@Injectable()
export class SportCenterRepository {

  constructor(
    @InjectRepository(SportCenter)
    private sportCenterRepository: Repository<SportCenter>,
  ) { }


  async getManagerCenters(user: User): Promise<SportCenter[]> {
    return await this.sportCenterRepository.find({ where: { main_manager: user } });
  }


  async putCategoryToCenter(
    sportCategories: Sport_Category[],
    sportCenter: SportCenter,
  ): Promise<SportCenter | undefined> {
    sportCenter.sport_categories = [
      ...new Set([...sportCenter.sport_categories, ...sportCategories]),
    ];

    const saved_sportcenter: SportCenter =
      await this.sportCenterRepository.save(sportCenter);

    return saved_sportcenter === null ? undefined : saved_sportcenter;
  }

  async countActiveAndDisable(manager: User) {
    const remainingActiveCenters = await this.sportCenterRepository.find({
      where: {
        main_manager: { id: manager.id },
        status: In([Sport_Center_Status.PUBLISHED, Sport_Center_Status.DISABLE]),
      },
    });
    return remainingActiveCenters;
  }


  async getSportCenters(page: number, limit: number, show_hidden: boolean, rating?: number, keyword?: string): Promise<SportCenterList> {
    const queryBuilder = this.sportCenterRepository
      .createQueryBuilder('sportcenter')
      .leftJoinAndSelect('sportcenter.photos', 'photos')
      .orderBy('sportcenter.averageRating', 'DESC', 'NULLS LAST');

    if (!show_hidden) {
      queryBuilder.andWhere('sportcenter.status = :status', {
        status: Sport_Center_Status.PUBLISHED,
      });
    }

    // Case-insensitive search for keyword
    if (keyword) {
      queryBuilder.andWhere(
        '(LOWER(sportcenter.name) LIKE LOWER(:keyword) OR LOWER(sportcenter.address) LIKE LOWER(:keyword))',
        { keyword: `%${keyword}%` },
      );
    }

    if (rating !== undefined) {
      queryBuilder.andWhere('sportcenter.averageRating <= :rating', { rating });
    }

    // Get total count before pagination
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const centers = await queryBuilder.getMany();

    return {
      items: totalCount,
      page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(totalCount / limit),
      sport_centers: centers.map(center => ({
        ...center,
        photos: center.photos === undefined ? [] : center.photos.map(image => image.image_url)
      }))
    };
  }


  async createSportCenter(future_manager: User, sportCenterData: Omit<CreateSportCenterDto, 'manager'>, images?: Image[],): Promise<SportCenter | undefined> {
    const saved_sportcenter: SportCenter = await this.sportCenterRepository.save(
      this.sportCenterRepository.create({
        ...sportCenterData,
        main_manager: future_manager,
        status: Sport_Center_Status.PUBLISHED,
        photos: images || undefined,
      }),
    );

    return saved_sportcenter === null ? undefined : saved_sportcenter;
  }


  async findOne(id: string, relations: boolean): Promise<SportCenter | undefined> {
    const found_sportcenter: SportCenter = await this.sportCenterRepository.findOne({
      where: { id: id }, relations: relations ? ['sport_categories', 'photos', "fields"] : []
    });

    return found_sportcenter === null ? undefined : found_sportcenter;
  }


  async updateSportCenter(sportCenter: SportCenter, updateData: UpdateSportCenterDto): Promise<SportCenter> {
    const updatedSportCenter = this.sportCenterRepository.merge(sportCenter, updateData);

    return await this.sportCenterRepository.save(updatedSportCenter);
  }


  async updateStatus(sportCenterInstance: SportCenter, status: Sport_Center_Status) {
    sportCenterInstance.status = status;
    return await this.sportCenterRepository.save(sportCenterInstance);
  }


  async deleteSportCenter(sportCenter: SportCenter): Promise<boolean> {
    const deleted: SportCenter = await this.sportCenterRepository.remove(sportCenter);

    return deleted === undefined ? false : true;
  }
}
