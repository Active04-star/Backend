import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { SportCenter_Module } from '../sport-center/sport-center.module';

@Module({
  imports: [SportCenter_Module, TypeOrmModule.forFeature([User, SportCenter])],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}