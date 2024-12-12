import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { User } from 'src/entities/user.entity';
import { SportCenterStatus } from 'src/enums/sportCenterStatus.enum';
import { Repository } from 'typeorm';

@Injectable()
export class SportCenterRepository {
  constructor(
    @InjectRepository(SportCenter)
    private sportCenterRepository: Repository<SportCenter>,
  ) {}

  async deleteSportCenter(sportCenter: SportCenter): Promise<void> {
    await this.sportCenterRepository.remove(sportCenter);
  }

  async countPublishedSportCenters(managerId: string): Promise<number> {
    return await this.sportCenterRepository.count({
      where: {
        manager: { id: managerId },
        status: SportCenterStatus.PUBLISHED,
      },
    });
  }

  async getSportCenters(): Promise<SportCenter[]> {
    return await this.sportCenterRepository.find({where:{
      status:SportCenterStatus.PUBLISHED
    }});
  }

  async createSportCenter(
    future_manager: User,
    sportCenterData: Omit<CreateSportCenterDto, 'manager' | 'photos'>,
  ) {
    const saved_sportcenter: SportCenter =
      await this.sportCenterRepository.save(
        this.sportCenterRepository.create({
          ...sportCenterData,
          manager: future_manager,
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
