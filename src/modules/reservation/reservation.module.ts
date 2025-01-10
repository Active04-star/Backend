import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { Reservation_Controller } from './reservation.controller';
import { Reservation_Service } from './reservation.service';
import { Reservation_Repository } from './reservation.repository';
import { Field_Block_Module } from '../field_blocks/field_schedule.module';
import { UserModule } from '../user/user.module';
import { Field_Module } from '../field/field.module';
import { User } from 'src/entities/user.entity';
import { notificationGateway } from '../notification.gateway.ts/websocket.gateway';

@Module({
  imports: [
    forwardRef(() => Field_Module),
    Field_Block_Module,
    UserModule,
    TypeOrmModule.forFeature([Reservation]),
  ],
  controllers: [Reservation_Controller],
  providers: [Reservation_Service, Reservation_Repository, notificationGateway],
  exports: [Reservation_Service],
})
export class Reservation_Module {}
