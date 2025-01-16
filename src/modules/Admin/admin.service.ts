import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiResponse } from 'src/dtos/api-response';
import { UserList } from 'src/dtos/user/users-list.dto';
import { Sport_Center_Status } from 'src/enums/sport_Center_Status.enum';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { AdminRepository } from './admin.repository';
import { Reservation } from 'src/entities/reservation.entity';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationList } from 'src/dtos/reservation/reservation-list.dto';
import { SportCenterService } from '../sport-center/sport-center.service';
import { UserService } from '../user/user.service';
import { Auth0Service } from '../auth0/auth0.service';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private readonly adminRepository: AdminRepository,
    private readonly centerService: SportCenterService,
    private readonly userService: UserService,
    private readonly auth0Service: Auth0Service,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }


  async getTotalUsers(): Promise<{ total: number }> {
    const total: number | undefined = await this.adminRepository.getTotalUsers();
    if (total === undefined) {
      throw new ApiError(ApiStatusEnum.CENTER_LIST_EMTPY, NotFoundException);
    }

    return { total: total };
  }


  async getPremiumUsers(): Promise<User[]> {
    const usersQueryBuilder = this.userRepository.createQueryBuilder('user');

    // Filter users that have a non-null stripeCustomerId
    usersQueryBuilder.where('user.stripeCustomerId IS NOT NULL');

    // Execute the query and get the result
    const users = await usersQueryBuilder.getMany();
    return users;
  }


  async getUsers(page: number, limit: number, search?: string): Promise<UserList> {
    const found_users: UserList = await this.adminRepository.getUsers(page, limit, search);

    if (found_users.users.length === 0) {
      throw new ApiError(ApiStatusEnum.USER_LIST_EMPTY, NotFoundException);
    }
    return found_users;
  }

  // agregar error a enum
  async getReservationByDate(
    page: number,
    limit: number,
    startDate: string,
    endDate: string,
  ): Promise<ReservationList> {
    const validstartDate = new Date(startDate);
    const validendDate = new Date(endDate);

    if (isNaN(validstartDate.getTime()) || isNaN(validendDate.getTime())) {
      throw new ApiError(ApiStatusEnum.INVALID_DATE_FORMAT, BadRequestException);

    }

    const foundReservation: ReservationList = await this.adminRepository.getReservationByDate(
      page,
      limit,
      validstartDate,
      validendDate,
    );

    if (foundReservation.reservations.length === 0) {
      throw new ApiError(ApiStatusEnum.RESERVATION_NOT_FOUND, NotFoundException);

    }

    return foundReservation;
  }


  async banOrUnbanUser(id: string): Promise<ApiResponse> {
    try {
      const found_user: User = await this.userService.getUserById(id);

      if (found_user.authtoken !== null) {
        await this.auth0Service.blockOrUnBlock(found_user);

      }

      const [updated_user, status]: [User, string] =
        await this.adminRepository.banOrUnbanUser(found_user);

      if (updated_user && status === 'deleted') {
        return { message: ApiStatusEnum.USER_DELETED };
      } else if (updated_user && status === 'restored') {
        return { message: ApiStatusEnum.USER_RESTORED };
      }

      throw new ApiError(ApiStatusEnum.USER_UNBAN_OR_BAN, BadRequestException, 'Something went wrong trying to modify this');
    } catch (error) {
      throw new ApiError(error?.message, BadRequestException, error);

    }

  }

  async banOrUnbanCenter(id: string, estado: Sport_Center_Status): Promise<ApiResponse> {
    const found_center: SportCenter = await this.centerService.getById(id, true);

    try {
      if (
        estado === Sport_Center_Status.BANNED &&
        found_center.fields.some((field) =>
          field.reservation.some(
            (reserva) => reserva.status === ReservationStatus.ACTIVE,
          ),
        )
      ) {
        return { message: ApiStatusEnum.CENTER_HAS_PENDING_RESERVATIONS };

      }

      const changeCenter: SportCenter = await this.centerService.banOrUnban(id, estado);
      if (changeCenter) {
        return { message: ApiStatusEnum.CENTER_UPDATE_STATUS };

      }

      throw new ApiError(ApiStatusEnum.CENTER_UPDATE_STATUS_FAILED, InternalServerErrorException);
    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error);

    }
  }

  async forceBan(id: string): Promise<ApiResponse> {
    try {
      const found_center: SportCenter = await this.centerService.getById(id, true);

      const forceBanPromises: Promise<Reservation>[] = [];

      for (const field of found_center.fields) {
        for (const reserva of field.reservation) {
          if (reserva.status === 'pending') {
            reserva.status = ReservationStatus.CANCELLED;
            forceBanPromises.push(this.reservationRepository.save(reserva));
          }
        }
      }
      //TODO POR AQUI DEBERIAMOS HACER QUE SE ENVIE UNA NOTIFICACION AVISANDO DE LA CANCELACION DE LAS RESERVAS (Y CANCELARLAS TODAS)

      await Promise.all(forceBanPromises);

      const changeCenter = await this.centerService.banOrUnban(id, Sport_Center_Status.BANNED);

      if (changeCenter) {
        return { message: ApiStatusEnum.CENTER_UPDATE_STATUS };

      }

      throw new ApiError(ApiStatusEnum.CENTER_DELETION_FAILED, InternalServerErrorException, 'nothing updated');
    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error);

    }
  }
}
