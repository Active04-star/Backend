import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReservationDto } from 'src/dtos/reservation/reservation-create.dto';
import { Field } from 'src/entities/field.entity';
import { Field_Block } from 'src/entities/field_blocks.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { User } from 'src/entities/user.entity';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
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

  // async createReservation(field: Field, field_block: Field_Block,user:User, reservationData:  Omit<createReservationDto,'userId'|'fieldId' | 'fieldBlockId'>):Promise<Reservation|undefined> {
  //   const saved_reservation: Reservation =
  //   await this.reservationRepository.save(
  //     this.reservationRepository.create({
  //       ...reservationData,
  //       field:field,
  //       fieldBlock:field_block,
  //       user: user,
  //       status:ReservationStatus.PENDING,
  //     }),
  //   );

  // return saved_reservation === null ? undefined : saved_reservation;
  //  }
}
