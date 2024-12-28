/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';
import { UserClean } from '../../dtos/user/user-clean.dto';
import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { isEmpty } from 'class-validator';
import { UpdateUser } from 'src/dtos/user/update-user.dto';
import { ApiError } from 'src/helpers/api-error-class';
import { UserRole } from 'src/enums/roles.enum';
import { AuthRegister } from 'src/dtos/user/auth-register.dto';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { Repository } from 'typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(Reservation)
    private readonly reservatioRepository: Repository<Reservation>,
  ) { }


  async getManagerSportCenter(id: string): Promise<{ id: string }> {
    const found_user: User | undefined = await this.userRepository.getUserById(id, true);

    if (isEmpty(found_user)) {
      throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
    } else if (found_user.managed_centers.length === 0) {
      throw new ApiError(ApiStatusEnum.NO_CENTER_FOR_THIS_USER, BadRequestException);

    }

    return { id: found_user.managed_centers[0].id };
  }


  async deleteUser(id: string): Promise<boolean> {
    const found_user: User = await this.userRepository.getUserById(id);
    return await this.userRepository.deleteUser(found_user);
  }


  async getUserByStripeCustomerId(customerId: string) {
    const found_user: User | undefined = await this.userRepository.getUserByStripeCustomerId(customerId);

    if (isEmpty(found_user)) {
      throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
    }
    return found_user;
  }


  async updateStripeCustomerId(user: User, customerId: any) {
    const updatedUser: User = await this.userRepository.updateStripeCustomerId(user, customerId);
    const { password, ...filtered_user } = updatedUser;

    return filtered_user;
  }


  async updateUser(id: string, modified_user: UpdateUser): Promise<UserClean> {
    const found_user: User | undefined = await this.userRepository.getUserById(id);

    if (isEmpty(found_user)) {
      throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
    }

    return new UserClean();
  }


  async hasActiveReservations(userId: string): Promise<boolean> {
    const activeReservation = await this.reservatioRepository
      .createQueryBuilder('reservation')
      .where('reservation.userId = :userId', { userId })
      .andWhere('reservation.status = :status', {
        status: ReservationStatus.ACTIVE,
      })
      .getOne();

    console.log('active', !!activeReservation);

    // Si se encuentra una reserva activa, devolver true
    return !!activeReservation;
  }

  // async rankUpTo(user: User, rank: UserRole): Promise<boolean> {
  //   if (this.hasActiveReservations(user.id)) {
  //     throw new ApiError(ApiStatusEnum.RANKING_UP_FAIL, BadRequestException);
  //   }

  //   const ranked_up: User | undefined = await this.userRepository.rankUpTo(
  //     user,
  //     rank,
  //   );

  //   if (ranked_up === undefined) {
  //     return false;
  //   }
  //   return true;
  // }


  async getUserById(id: string, relations = false): Promise<User> {
    const found_user: User | undefined = await this.userRepository.getUserById(id, relations);

    if (isEmpty(found_user)) {
      throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
    }
    return found_user;
  }


  async getUserByMail(email: string): Promise<User | undefined> {
    const found: User | undefined = await this.userRepository.getUserByMail(email);
    //ESTA FUNCION NUNCA DEBE LANZAR ERROR
    return found;
  }


  async createUser(userObject: Omit<LocalRegister, 'confirm_password'> | AuthRegister): Promise<UserClean> {
    try {
      const created_user: User = await this.userRepository.createUser(userObject);
      const { password, authtoken, ...filtered } = created_user;

      return filtered;
    } catch (error) {
      throw new ApiError(error?.message, BadRequestException, error);

    }
  }

}
