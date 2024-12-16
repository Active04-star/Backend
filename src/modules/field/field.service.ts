import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Field_Repository } from './field.repository';
import { SportCenterService } from '../sport-center/sport-center.service';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { Field } from 'src/entities/field.entity';
import { FieldDto } from 'src/dtos/field/createField.dto';
import { Sport_Category_Service } from '../sport-category/sport-category.service';

@Injectable()
export class Field_Service {
  constructor(
    private readonly fieldRepository: Field_Repository,
    private sportCenterService: SportCenterService,
    private sportCategoryService:Sport_Category_Service
    
  ) {}

  async createField(fieldData:FieldDto) {
    const sportCenter:SportCenter=await this.sportCenterService.findOne(fieldData.sportCenterId)

    const sportCategory = fieldData.sportCategoryId
    ? await this.sportCategoryService.findById(fieldData.sportCategoryId)
    : null


    const created_field: Field | undefined =
      await this.fieldRepository.createField(
        sportCenter,
        fieldData,
      );

      if (created_field === undefined) {
        throw new HttpException(
          'problema de servidor',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
     return created_field

  }

  async deleteField(id: string) {}
}
