import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';
import { notificationGateway } from '../notification.gateway.ts/websocket.gateway';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';

@Injectable()
export class Reservation_Repository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly notificationGateway: notificationGateway,
  ) {}

  async cancelReservation(reservation: Reservation): Promise<Reservation> {
    reservation.status=ReservationStatus.CANCELLED
    return await this.reservationRepository.save(reservation);
  }

  async findById(id: string): Promise<Reservation | undefined> {
    const found_reservation: Reservation | null =
      await this.reservationRepository.findOne({ where: { id: id } ,relations:['fieldBlock','field']});

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
    

    async getResevationCron(): Promise<Reservation[]> {
      const now = new Date()
      const oneHour = new Date(now)
      oneHour.setHours(now.getHours() + 1)

      const startRange = new Date(oneHour)
      startRange.setSeconds(0,0)

      const endRange = new Date(oneHour)
      endRange.setSeconds(59, 999)

      return await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.status = :status', {status: 'active'})
      .andWhere('reservation.date BETWEEN :startRange AND :endRange', {startRange, endRange})
      .getMany()
    }

    async notifyUser(reservation: Reservation) {
      const message = `Tu reserva para ${reservation.id} comienza en 1 hora`;
      this.notificationGateway.sendNotification(reservation.user.id, message)
    }

    async reservationnotify(): Promise<Reservation[]> {
      const now = new Date()
      
      const startRange = new Date(now)
      startRange.setMinutes(now.getMinutes() - 1)

      return await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.status = :status', {status: 'active'})
      .andWhere('reservation.createdAt BETWEEN :startRange AND :now', {startRange, now})
      .getMany()
    }

    async notifyreservationUser(reservation: Reservation) {
      const message = `Tu reserva ah sido registrada correctamente`;
      this.notificationGateway.sendNotification(reservation.user.id, message)
    }
}