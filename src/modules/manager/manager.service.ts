import { BadRequestException, Injectable } from '@nestjs/common';
import { Field } from 'src/entities/field.entity';
import { Field_Service } from '../field/field.service';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { Sport_Center_Status } from 'src/enums/sport_Center_Status.enum';
import { SportCenterService } from '../sport-center/sport-center.service';

@Injectable()
export class ManagerService {
  constructor(
    private fieldService: Field_Service,
    private userService: UserService,
    @InjectRepository(SportCenter)
    private sportCenterRepository: Repository<SportCenter>,
    private sportCenterService: SportCenterService,
  ) {}

  async assingCategoriesToSCenter() {
    //asigna deportes a un centro
  }

  async publishSportCenter(
    userId: string,
    sportCenterId: string,
  ): Promise<SportCenter> {
    const found_sportcenter = await this.sportCenterRepository.findOne({
      where: { id: sportCenterId, main_manager: { id: userId } },
      relations: ['schedules', 'fields'],
    });

    if (!found_sportcenter) {
      throw new ApiError(ApiStatusEnum.CENTER_NOT_FOUND, BadRequestException);
    }

    if (
      !found_sportcenter.fields.length ||
      !found_sportcenter.schedules.length
    ) {
      throw new ApiError(
        ApiStatusEnum.CENTER_IS_NOT_COMPLETED,
        BadRequestException,
      );
    }

    return await this.sportCenterService.updateStatus(
      userId,
      found_sportcenter.id,
      Sport_Center_Status.PUBLISHED,
    );
  }

  async getManagerSportCenter(id: string): Promise<SportCenter> {
    const found_user: User | undefined = await this.userService.getUserById(id);

    if (found_user.managed_centers.length === 0) {
      throw new ApiError(
        ApiStatusEnum.NO_CENTER_FOR_THIS_USER,
        BadRequestException,
      );
    }

    const sportCenter: SportCenter = await this.sportCenterRepository.findOne({
      where: { main_manager: { id: found_user.id } },
      relations: ['schedules', 'photos', 'sport_categories'],
    });

    return sportCenter;
  }

  async getManagerFields(centerId: string): Promise<Field[]> {
    return await this.fieldService.getFields(centerId);
  }

  async getManagerReservations(managerId: string) {
    const user: User = await this.userService.getUserById(managerId);
    return await this.sportCenterRepository
      .createQueryBuilder('sportCenter')
      .leftJoinAndSelect('sportCenter.fields', 'field') // Unir con las canchas
      .leftJoinAndSelect(
        'field.reservations',
        'reservation',
        'reservation.status = :status',
        { status: 'ACTIVE' },
      )
      .where('sportCenter.main_manager.id = :managerId', { managerId: user.id }) // Filtrar por el manager
      .orderBy('reservation.date', 'ASC') // Ordenar reservas por fecha
      .getMany();
  }
}
