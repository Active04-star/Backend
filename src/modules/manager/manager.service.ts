import { BadRequestException, Injectable } from '@nestjs/common';
import { Field } from 'src/entities/field.entity';
import { Field_Service } from '../field/field.service';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';

@Injectable()
export class ManagerService {
  
 
  constructor(
    private fieldService: Field_Service,
    private userService: UserService,
    @InjectRepository(SportCenter)
    private sportCenterRepository: Repository<SportCenter>,
  ) {}
  async publish(userId: string, sportCenterId: string) {
    throw new Error('Method not implemented.');
  }

  async getManagerSportCenter(id: string): Promise<SportCenter> {
    const found_user: User | undefined = await this.userService.getUserById(id);

    if (found_user.managed_centers.length === 0) {
      throw new ApiError(ApiStatusEnum.NO_CENTER_FOR_THIS_USER, BadRequestException);
    }

    return found_user.managed_centers[0];
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
      .where('sportCenter.main_manager.id = :managerId', { managerId }) // Filtrar por el manager
      .orderBy('reservation.date', 'ASC') // Ordenar reservas por fecha
      .getMany();
  }


  
}
