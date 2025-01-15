import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationList } from 'src/dtos/reservation/reservation-list.dto';
import { UserList } from 'src/dtos/user/users-list.dto';
import { Reservation } from 'src/entities/reservation.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminRepository {

  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }


  async getUsers(page: number, limit: number, keyword?: string): Promise<UserList> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('users');

    if (keyword) {
      queryBuilder.andWhere(
        '(LOWER(users.name) LIKE LOWER(:keyword) OR LOWER(users.email) LIKE LOWER(:keyword))',
        { keyword: `%${keyword}%` },
      );
    }

    const totalCount = await queryBuilder.getCount();

    queryBuilder.skip((page - 1) * limit).take(limit);

    const users = await queryBuilder.getMany();

    return {
      items: totalCount,
      page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(totalCount / limit),
      users: users,
    };
  }


  async getReservationByDate(page: number, limit: number, startDate: Date, endDate: Date): Promise<ReservationList> {
    const query = this.reservationRepository.createQueryBuilder('reservation')
      .where('reservation.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .skip((page - 1) * limit)
      .take(limit)
    const [reservations, total] = await query.getManyAndCount();

    return {
      items: total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      reservations,
    };
  }


  async banOrUnbanUser(
    userToModify: User,
  ): Promise<[User, 'deleted' | 'restored']> {
    userToModify.was_banned = !userToModify.was_banned;
    const user: User = await this.userRepository.save(userToModify);
    return [user, user.was_banned ? 'deleted' : 'restored'];
  }

}
