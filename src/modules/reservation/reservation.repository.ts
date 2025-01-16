import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';
import { notificationGateway } from '../notification.gateway.ts/websocket.gateway';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class Reservation_Repository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly notificationGateway: notificationGateway,
    private readonly mailService: MailerService,
  ) { }


  async cancelReservation(reservation: Reservation): Promise<Reservation> {
    reservation.status = ReservationStatus.CANCELLED
    return await this.reservationRepository.save(reservation);
  }

  async findById(id: string): Promise<Reservation | undefined> {
    const found_reservation: Reservation | null =
      await this.reservationRepository.findOne({ where: { id: id }, relations: ['fieldBlock', 'field'] });

    return found_reservation === null ? undefined : found_reservation;
  }

  async getReservationByUser(id: string): Promise<Reservation[]> {
    return await this.reservationRepository.find({ where: { user: { id: id } }, relations: { user: false } });
  }

  async getReservationById(id: string): Promise<Reservation> {
    const reservation: Reservation | null = await this.reservationRepository.findOne({ where: { id: id } })
    return reservation
  }


  async getResevationCron(): Promise<Reservation[]> {
    const now = new Date(Date.now())
    const oneHour = new Date(now)
    oneHour.setHours(now.getHours() + 1);

    const startRange = new Date(oneHour)
    startRange.setSeconds(0, 0)

    const endRange = new Date(oneHour)
    endRange.setSeconds(59, 999)

    return await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .where('reservation.status = :status', { status: 'active' })
      .andWhere('reservation.date BETWEEN :startRange AND :endRange', {
        startRange,
        endRange
      })
      .getMany()
  }

  async notifyUser(reservation: Reservation) {
    const message = `Tu reserva para ${reservation.id} comienza en 1 hora`;
    this.notificationGateway.sendNotification(reservation.user.id, message)
  }

  async reservationnotify(): Promise<Reservation[]> {
    const now = new Date()
    const nowUtc = new Date(Date.now())

    const startRangeUtc = new Date(Date.now() - 3600 * 1000); // Hace un minuto en UTC
    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.field', 'field')
      .leftJoinAndSelect('field.sportcenter', 'sportcenter') 
      .leftJoinAndSelect('sportcenter.main_manager', 'main_manager')  
      .where('reservation.status = :status', {status: 'active'})
      .andWhere('reservation.createdAt BETWEEN :startRangeUtc AND :now', {startRangeUtc: startRangeUtc.toISOString(), now: nowUtc.toISOString()})
      .getMany()
      
      if (!reservations || reservations.length === 0) {
        console.log("No se encontraron reservas dentro del rango especificado.");
      }
      return reservations

    }
    
    async notifyreservationUser(reservation: Reservation) {
      const message = `Tines una nueva Reserva en tu cancha`;
      // console.log(this.mailService['transporter'].options);   //BORRAR SOLO ES PARA PRUEBA
      await this.sendWelcomeMail({name: reservation.field.sportcenter.main_manager.name, email: reservation.field.sportcenter.main_manager.email})
      this.notificationGateway.sendNotification(reservation.field.sportcenter.main_manager.id, message)
    }

    private async sendWelcomeMail(user: { name: string, email: string }): Promise<void> {
      console.log(user.email)
      await this.mailService.sendMail({
        from: 'ActiveProject <activeproject04@gmail.com>',
        to: user.email,
        subject: 'Welcome to our app',
        template: 'registration',
        context: {
          name: user.name,
          contactEmail: 'activeproject04@gmail.com',
        }
  
      });
    }

  async completeReservation(reservation: Reservation): Promise<Reservation> {
    reservation.status = ReservationStatus.COMPLETED
    return await this.reservationRepository.save(reservation)
  }

}