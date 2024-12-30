import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { SportCenter_Module } from '../sport-center/sport-center.module';
import { Field_Module } from '../field/field.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule,SportCenter_Module, Field_Module, TypeOrmModule.forFeature([SportCenter])],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}