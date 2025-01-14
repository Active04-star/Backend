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
import { Reservation } from 'src/entities/reservation.entity';

@Injectable()
export class ManagerService {
  constructor(
    private fieldService: Field_Service,
    private userService: UserService,
    @InjectRepository(SportCenter)
    private sportCenterRepository: Repository<SportCenter>,
    private sportCenterService: SportCenterService,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
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

  async getManagerReservations(managerId: string):Promise<Reservation[]> {
    const user: User = await this.userService.getUserById(managerId);
    const reservations:Reservation[] = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.field', 'field')
      .leftJoinAndSelect('field.sportcenter', 'sportcenter')
      .leftJoinAndSelect('sportcenter.main_manager', 'main_manager')
      .where('main_manager.id = :managerId', { managerId })
      .getMany();

    return reservations;
  }
}

// async getReservationByDate(page: number, limit: number, startDate: string, endDate: string, sportCenterId: string): Promise<reservationList>{
//   const validstartDate = new Date(startDate)
//   const validendDate = new Date(endDate)
//   if(isNaN(validstartDate.getTime()) || isNaN(validendDate.getTime())) {
//     throw new Error('las fechas no son validas')
//   }
//   const relations = false
//   const foundsportcenter = await this.sportCenterRepository.findOne(sportCenterId, relations)

//       if (foundsportcenter === undefined) {
//         throw new ApiError(ApiStatusEnum.CENTER_NOT_FOUND, NotFoundException);
//       }

//   const query = this.reservationRepository.createQueryBuilder('reservation')
//   .innerJoin('reservation.field', 'field')
//   .innerJoin('field.sportcenter', 'sportcenter')
//   .where('reservation.createdAt BETWEEN :startDate AND :endDate', {startDate, endDate})
//   .andWhere('sportcenter.id = :sportCenterId', {sportCenterId})
//   .skip((page - 1) * limit)
//   .take(limit)

//   const [reservations, total] = await query.getManyAndCount();

//   return {
//     items: total,
//     page,
//     limit,
//     total_pages: Math.ceil(total / limit),
//     reservations,
//   }
// }
