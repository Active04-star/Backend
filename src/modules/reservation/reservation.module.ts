import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { Reservation_Controller } from './reservation.controller';
import { Reservation_Service } from './reservation.service';
import { Reservation_Repository } from './reservation.repository';
import { UserModule } from '../user/user.module';
import { Field_Module } from '../field/field.module';
import { notificationGateway } from '../notification.gateway.ts/websocket.gateway';
import { Field_Block } from 'src/entities/field_blocks.entity';
import { AuthModule } from '../auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule,
    forwardRef(() => Field_Module),
    UserModule,
    TypeOrmModule.forFeature([Reservation,Field_Block]),
  ],
  controllers: [Reservation_Controller],
  providers: [Reservation_Service, Reservation_Repository, notificationGateway],
  exports: [Reservation_Service, Reservation_Repository],
})
export class Reservation_Module {}
