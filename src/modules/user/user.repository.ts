/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNotEmpty } from 'class-validator';
import { AuthRegister } from 'src/dtos/user/auth-register.dto';
import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { UpdateUser } from 'src/dtos/user/update-user.dto';
import { UserList } from 'src/dtos/user/users-list.dto';
import { User } from 'src/entities/user.entity';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { UserRole } from 'src/enums/roles.enum';
import { ApiError } from 'src/helpers/api-error-class';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async hasActiveReservations(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.reservations', 'reservation')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new ApiError(
        ApiStatusEnum.USER_NOT_FOUND,
        InternalServerErrorException,
      );
    }

    const activeReservations =
      user.reservations?.filter(
        (reservation) => reservation.status === ReservationStatus.ACTIVE,
      ) || [];

    return activeReservations.length > 0;
  }

  async deleteUser(userInstance: User): Promise<boolean> {
    const found_user: User | undefined =
      await this.userRepository.remove(userInstance);
    return found_user === undefined ? false : true;
  }

  async getUserByStripeCustomerId(customerId: string) {
    const found_user: User | null = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });
    return found_user === null ? undefined : found_user;
  }

  async updateStripeCustomerId(user: User, customerId: any) {
    user.stripeCustomerId = customerId;
    await this.userRepository.save(user);
    return user;
  }

  async updateUser(actual_user: User, modified_user: Partial<Pick<User, "name" | "profile_image" | "authtoken" | "password">>): Promise<User> {
    const merged_user: User = this.userRepository.merge(actual_user, modified_user);

    return await this.userRepository.save(merged_user);
  }

  async rankUpTo(user: User, role: UserRole): Promise<User> {
    const {managed_centers, ...usernew} = user;
    usernew.role = role;
    return await this.userRepository.save(usernew);
  }

  async getUserById(id: string): Promise<User | undefined> {
    const found_user: User | null = await this.userRepository.findOne({
      where: { id: id },
      relations: { managed_centers: true },
    });
    return found_user === null ? undefined : found_user;
  }


  async createUser(userObject: Omit<LocalRegister, 'confirm_password'> | AuthRegister): Promise<User> {
    let created_user: User;

    if (this.isLocalRegister(userObject)) {
      if (isNotEmpty(userObject.password)) {
        created_user = this.userRepository.create(userObject);
      }
    } else if (this.isAuthRegister(userObject)) {
      if (isNotEmpty(userObject.sub)) {
        const { sub, ...rest } = userObject;
        created_user = this.userRepository.create({ authtoken: sub, ...rest });
      }
    }

    return await this.userRepository.save(created_user);
  }


  async createAdmin(userObject: Omit<LocalRegister, 'confirm_password'> | AuthRegister): Promise<User> {
    let created_user: User;

    if (this.isLocalRegister(userObject)) {
      if (isNotEmpty(userObject.password)) {
        created_user = this.userRepository.create({...userObject, role: UserRole.ADMIN});
      }

    } else if (this.isAuthRegister(userObject)) {
      if (isNotEmpty(userObject.sub)) {
        const { sub, ...rest } = userObject;
        created_user = this.userRepository.create({ authtoken: sub, ...rest, role: UserRole.ADMIN });
      }
    }

    return await this.userRepository.save(created_user);
    
  }


  async getUserByMail(email: string): Promise<User | undefined> {
    const found: User | null = await this.userRepository.findOne({
      where: { email: email },
    });
    return found ? found : undefined;
  }

  private isLocalRegister(
    userObject: any,
  ): userObject is Omit<LocalRegister, 'confirm_password'> {
    return 'password' in userObject;
  }

  private isAuthRegister(userObject: any): userObject is AuthRegister {
    return 'sub' in userObject;
  }
}
