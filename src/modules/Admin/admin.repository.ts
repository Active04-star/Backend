import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SportCenterList } from 'src/dtos/sportcenter/sport-center-list.dto';
import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { UpdateUser } from 'src/dtos/user/update-user.dto';
import { UserList } from 'src/dtos/user/users-list.dto';
import { Reservation } from 'src/entities/reservation.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { User } from 'src/entities/user.entity';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { UserRole } from 'src/enums/roles.enum';
import { Sport_Center_Status } from 'src/enums/sport_Center_Status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(SportCenter)
    private sportCenterRepository: Repository<SportCenter>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number): Promise<UserList> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items: total,
      page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(total / limit),
      users: users.map(
        ({ password, ...userWithoutPassword }) => userWithoutPassword,
      ),
    };
  }

  async getUserById(id: string): Promise<User | undefined> {
    const found_user: User | null = await this.userRepository.findOne({
      where: { id: id },
    });
    return found_user === null ? undefined : found_user;
  }

  async banOrUnbanUser(
    userToModify: User,
  ): Promise<[User, 'deleted' | 'restored']> {
    userToModify.was_banned = !userToModify.was_banned;
    const user: User = await this.userRepository.save(userToModify);
    return [user, user.was_banned ? 'deleted' : 'restored'];
  }

  async getCenterById(id: string): Promise<SportCenter | undefined> {
    const found_center: SportCenter | null =
      await this.sportCenterRepository.findOne({
        where: { id: id },
        relations: ['fields', 'fields.reservation'],
        select: {
          fields: {
            reservation: {
              status: true,
            },
          },
        },
      });
    return found_center === null ? undefined : found_center;
  }

  async banOrUnbanCenter(
    found_center: SportCenter,
    estado: Sport_Center_Status,
  ): Promise<SportCenter> {
    found_center.status = estado;
    const center: SportCenter =
      await this.sportCenterRepository.save(found_center);
    return center;
  }
}
