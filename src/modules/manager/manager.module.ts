import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, SportCenter])],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}