import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Reservation_Repository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async cancelReservation(reservation: Reservation): Promise<Reservation> {
    return await this.reservationRepository.remove(reservation);
  }

  async findById(id: string): Promise<Reservation | undefined> {
    const found_reservation: Reservation | null =
      await this.reservationRepository.findOne({ where: { id: id } });

    return found_reservation === null ? undefined : found_reservation;
  }

    async getReservationByUser(id: string): Promise<Reservation[]> {
      return await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .where('user.id = :id', { id })
      .getMany()
    }

    async getReservationById(id: string): Promise<Reservation> {
      const reservation: Reservation | null = await this.reservationRepository.findOne( {where: {id: id}})
      return reservation
    }
}