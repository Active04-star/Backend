import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
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

  async deleteSportCenter(sportCenter: SportCenter): Promise<void> {
    await this.sportCenterRepository.remove(sportCenter);
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



  async getSportCenters(page: number, limit: number,rating?:number,keyword?:string): Promise<SportCenter[]> {
    const queryBuilder = this.sportCenterRepository
    .createQueryBuilder('sportcenter')
    .leftJoinAndSelect('sportcenter.reviews', 'review')
    .where('sportcenter.status = :status', {
      status: SportCenterStatus.PUBLISHED,
    })
    .addSelect('AVG(review.rating)', 'averageRating') // Calcula el promedio de ratings
    .groupBy('sportcenter.id') // Agrupa por cada SportCenter
    .orderBy('averageRating', 'DESC', 'NULLS LAST'); // Ordena por promedio de rating (NULLS al final)

  // Filtro por keyword (nombre o dirección)
  if (keyword) {
    queryBuilder.andWhere(
      '(sportcenter.name LIKE :keyword OR sportcenter.address LIKE :keyword)',
      { keyword: `%${keyword}%` }
    );
  }

  // Filtro por rating (si se proporciona)
  if (rating !== undefined) {
    queryBuilder.andHaving('averageRating >= :rating', { rating });
  }

  // Aplica paginación si se proporcionan page y limit
  if (page && limit) {
    queryBuilder.skip((page - 1) * limit).take(limit);
  }

  // Ejecuta el query y devuelve los resultados
  const results = await queryBuilder.getRawAndEntities();
  return results.entities;
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
}
