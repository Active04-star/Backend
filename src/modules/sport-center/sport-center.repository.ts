import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { SportCenterList } from 'src/dtos/sportcenter/sport-center-list.dto';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
import { Image } from 'src/entities/image.entity';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { User } from 'src/entities/user.entity';
import { SportCenterStatus } from 'src/enums/sportCenterStatus.enum';
import { In, Repository } from 'typeorm';

@Injectable()
export class SportCenterRepository {

  constructor(@InjectRepository(SportCenter) private sportCenterRepository: Repository<SportCenter>) { }


  async putCategoryToCenter(sportCategories: Sport_Category[], sportCenter: SportCenter): Promise<SportCenter | undefined> {
    sportCenter.sport_categories = [
      ...new Set([...sportCenter.sport_categories, ...sportCategories]),
    ];

    const saved_sportcenter: SportCenter = await this.sportCenterRepository.save(sportCenter)

    return saved_sportcenter === null ? undefined : saved_sportcenter;

  }


  async countActiveAndDisable(manager: User) {
    const remainingActiveCenters = await this.sportCenterRepository.find({
      where: {
        main_manager: { id: manager.id },
        status: In([SportCenterStatus.PUBLISHED, SportCenterStatus.DISABLE]),
      },
    });
    return remainingActiveCenters
  }


  async getSportCenters(page: number, limit: number, show_hidden: boolean, rating?: number, keyword?: string): Promise<SportCenterList> {

    const queryBuilder = this.sportCenterRepository
      .createQueryBuilder('sportcenter')
      .orderBy('sportcenter.averageRating', 'DESC', 'NULLS LAST'); // Ordena por averageRating directamente

    if (!show_hidden) {
      queryBuilder.andWhere('sportcenter.status = :status', { status: SportCenterStatus.PUBLISHED, })
    }

    // Filtro por keyword (nombre o dirección)
    if (keyword) {
      queryBuilder.andWhere('(sportcenter.name LIKE :keyword OR sportcenter.address LIKE :keyword)', { keyword: `%${keyword}%` });
    }

    // Filtro por rating (si se proporciona)
    if (rating !== undefined) {
      queryBuilder.andWhere('sportcenter.averageRating >= :rating', { rating });
    }

    // Aplica paginación si se proporcionan page y limit
    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const centers: SportCenter[] = await queryBuilder.getMany();

    // Ejecuta el query y devuelve los resultados
    return {
      items: centers.length,
      page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(centers.length / limit),
      sport_centers: centers.map(center => ({
        ...center,
        photos: center.photos === undefined ? [] : center.photos.map(image => image.image_url)
      }))
    };
  }


  async createSportCenter(future_manager: User, sportCenterData: Omit<CreateSportCenterDto, 'manager' | "images">, images?: Image[]): Promise<SportCenter | undefined> {
    const saved_sportcenter: SportCenter = await this.sportCenterRepository.save(this.sportCenterRepository.create({
      ...sportCenterData, main_manager: future_manager, photos: images || undefined,
    }));

    return saved_sportcenter === null ? undefined : saved_sportcenter;
  }


  async findOne(id: string): Promise<SportCenter | undefined> {
    const found_sportcenter: SportCenter = await this.sportCenterRepository.findOne({ where: { id: id }, relations: { photos: true } });

    return found_sportcenter === null ? undefined : found_sportcenter;
  }


  async updateSportCenter(sportCenter: SportCenter, updateData: UpdateSportCenterDto): Promise<SportCenter> {
    const updatedSportCenter = this.sportCenterRepository.merge(sportCenter, updateData);

    return await this.sportCenterRepository.save(updatedSportCenter);
  }


  async updateStatus(sportCenterInstance: SportCenter, status: SportCenterStatus) {
    sportCenterInstance.status = status;
    return await this.sportCenterRepository.save(sportCenterInstance);
  }


  async deleteSportCenter(sportCenter: SportCenter): Promise<boolean> {
    const deleted: SportCenter = await this.sportCenterRepository.remove(sportCenter);

    return deleted === undefined ? false : true;
  }
}
