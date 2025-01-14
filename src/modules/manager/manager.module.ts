import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { SportCenter_Module } from '../sport-center/sport-center.module';
import { Field_Module } from '../field/field.module';
import { UserModule } from '../user/user.module';
import { Field } from 'src/entities/field.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { Reservation_Module } from '../reservation/reservation.module';

@Module({
  imports: [
    UserModule,
    SportCenter_Module, 
    Field_Module, 
    Reservation_Module,
    TypeOrmModule.forFeature([SportCenter, Field, Reservation])],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}