import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { Sport_Category_Controller } from './sport-category.controller';
import { Sport_Category_Service } from './sport-category.service';
import { Sport_Category_Repository } from './sport-category.repository';
import { Sport_Center_Module } from '../sport-center/sport-center.module';

@Module({
  imports: [
    forwardRef(() => Sport_Center_Module),
    TypeOrmModule.forFeature([Sport_Category]),
  ],
  controllers: [Sport_Category_Controller],
  providers: [Sport_Category_Service, Sport_Category_Repository],
  exports: [Sport_Category_Service],
})
export class Sport_Cateogry_Module {}
