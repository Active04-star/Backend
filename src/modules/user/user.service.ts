/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export class UserService {

  constructor(private readonly userRepository: UserRepository) { }


  async putAuthToken(user: User, sub: string): Promise<void> {
    const updated_user: User | undefined = await this.userRepository.updateUser(user, { authtoken: sub });

    if (!updated_user) {
      throw new ApiError(ApiStatusEnum.USER_UPDATE_FAILED, InternalServerErrorException);
    }

  }


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
    const found_user: User | undefined =
      await this.userRepository.getUserByStripeCustomerId(customerId);

    if (isEmpty(found_user)) {
      throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
    }
    return found_user;
  }


  async updateStripeCustomerId(user: User, customerId: any) {
    const updatedUser: User = await this.userRepository.updateStripeCustomerId(
      user,
      customerId,
    );
    const { password, ...filtered_user } = updatedUser;

    return filtered_user;
  }


  /**
   * Los unicos campos de usuario que deben ser actualizados por esta funcion son:
   * - `name`
   * - `profile_image`
   * - `authtoken`
   * - `password`
   */
  async updateUser(id: string, modified_user: Partial<Pick<User, "name" | "profile_image" | "authtoken" | "password">>): Promise<UserClean> {
    const found_user: User | undefined = await this.userRepository.getUserById(id);

    if (isEmpty(found_user)) {
      throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
    }

    const { authtoken, password, ...clean_user } = await this.userRepository.updateUser(found_user, modified_user);
    return clean_user;
  }


  async hasActiveReservations(userId: string) {
    const hasreservations: boolean = await this.userRepository.hasActiveReservations(userId);

    if (hasreservations) {
      throw new ApiError(ApiStatusEnum.USER_HAS_RESERVATIONS, BadRequestException);

    }
  }


  async rankUpTo(user: User, rank: UserRole): Promise<void> {
    const ranked_up: User | undefined = await this.userRepository.rankUpTo(user, rank);

    if (!ranked_up) {
      throw new ApiError(ApiStatusEnum.USER_RANKUP_FAILED, InternalServerErrorException);
    }
  }


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
