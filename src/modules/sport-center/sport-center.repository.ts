import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { User } from 'src/entities/user.entity';
import { SportCenterStatus } from 'src/enums/sportCenterStatus.enum';
import { In, Repository } from 'typeorm';

@Injectable()
export class SportCenterRepository {
  
  constructor(
    @InjectRepository(SportCenter)
    private sportCenterRepository: Repository<SportCenter>,
  ) {}

  async assignCategoriesToSportCenter(sportCategories:Sport_Category[], sportCenter: SportCenter):Promise<SportCenter|undefined> {
    sportCenter.sport_categories = [
      ...new Set([...sportCenter.sport_categories, ...sportCategories]),
    ];

    const saved_sportcenter:SportCenter=await this.sportCenterRepository.save(sportCenter)

    return saved_sportcenter === null ? undefined : saved_sportcenter;

  }


 async countActiveAndDisable(manager:User){
  const remainingActiveCenters = await this.sportCenterRepository.find({
    where: {
      main_manager: { id: manager.id },
      status: In([SportCenterStatus.PUBLISHED, SportCenterStatus.DISABLE]),
    },
  });
  return remainingActiveCenters
 }



 async getSportCenters(
  page: number,
  limit: number,
  rating?: number,
  keyword?: string,
): Promise<SportCenter[]> {
  const queryBuilder = this.sportCenterRepository
    .createQueryBuilder('sportcenter')
    .where('sportcenter.status = :status', {
      status: SportCenterStatus.PUBLISHED,
    })
    .orderBy('sportcenter.averageRating', 'DESC', 'NULLS LAST'); // Ordena por averageRating directamente

  // Filtro por keyword (nombre o dirección)
  if (keyword) {
    queryBuilder.andWhere(
      '(sportcenter.name LIKE :keyword OR sportcenter.address LIKE :keyword)',
      { keyword: `%${keyword}%` },
    );
  }

  // Filtro por rating (si se proporciona)
  if (rating !== undefined) {
    queryBuilder.andWhere('sportcenter.averageRating >= :rating', { rating });
  }

  // Aplica paginación si se proporcionan page y limit
  if (page && limit) {
    queryBuilder.skip((page - 1) * limit).take(limit);
  }

  // Ejecuta el query y devuelve los resultados
  return queryBuilder.getMany();
}


  async createSportCenter(
    future_manager: User,
    sportCenterData: Omit<CreateSportCenterDto, 'manager' | 'photos'>,
  ) {
    const saved_sportcenter: SportCenter =
      await this.sportCenterRepository.save(
        this.sportCenterRepository.create({
          ...sportCenterData,
          main_manager: future_manager,
        }),
      );
    return saved_sportcenter === null ? undefined : saved_sportcenter;
  }

  async findOne(id: string): Promise<SportCenter | undefined> {
    const found_sportcenter = await this.sportCenterRepository
      .createQueryBuilder('sportcenter')
      .leftJoinAndSelect('sportcenter.manager', 'manager')
      .leftJoinAndSelect('sportcenter.reviews', 'reviews')
      .leftJoinAndSelect('sportcenter.field', 'field')
      .leftJoinAndSelect('sportcenter.sport_category', 'sport_category')
      .leftJoinAndSelect('sportcenter.photos', 'photos')
      .where('sportcenter.id = :id', { id })
      .getOne();
    return found_sportcenter === null ? undefined : found_sportcenter;
  }

  async updateSportCenter(
    sportCenter: SportCenter,
    updateData: UpdateSportCenterDto,
  ): Promise<SportCenter> {
    const updatedSportCenter = this.sportCenterRepository.merge(
      sportCenter,
      updateData,
    );

    return await this.sportCenterRepository.save(updatedSportCenter);
  }

  async publishSportCenter(found_sportcenter: SportCenter) {
    found_sportcenter.status = SportCenterStatus.PUBLISHED;
    return await this.sportCenterRepository.save(found_sportcenter);
  }

  async disableSportCenter(
    found_sportcenter: SportCenter,
  ): Promise<SportCenter> {
    found_sportcenter.status = SportCenterStatus.DISABLE;
    return await this.sportCenterRepository.save(found_sportcenter);
  }



  async deleteSportCenter(sportCenter: SportCenter): Promise<void> {
    await this.sportCenterRepository.remove(sportCenter);


  }
}
