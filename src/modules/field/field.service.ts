import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Field_Repository } from './field.repository';
import { SportCenterService } from '../sport-center/sport-center.service';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { Field } from 'src/entities/field.entity';
import { FieldDto } from 'src/dtos/field/createField.dto';
import { Sport_Category_Service } from '../sport-category/sport-category.service';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';
import { UpdateFieldDto } from 'src/dtos/field/updateField.dto';

@Injectable()
export class Field_Service {
 
  constructor(
    private readonly fieldRepository: Field_Repository,
    private sportCenterService: SportCenterService,
    private sportCategoryService:Sport_Category_Service,
    @InjectRepository(Reservation)
    private reservationRepository:Repository<Reservation>
  ) {}


 async  updateField(data: UpdateFieldDto) :Promise<Field>{
  const field = await this.fieldRepository.findById(data.id);
  const updatedField=await this.fieldRepository.updateField(field,data)
  return updatedField
}

  async createField(fieldData:FieldDto) {
    const sportCenter:SportCenter=await this.sportCenterService.getById(fieldData.sportCenterId)

    const sportCategory = fieldData.sportCategoryId
    ? await this.sportCategoryService.findById(fieldData.sportCategoryId)
    : null


    const created_field: Field | undefined =
      await this.fieldRepository.createField(
        sportCenter,sportCategory,
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

  async findById(id:string){
    const found_field: Field | undefined =
    await this.fieldRepository.findById(id);

  if (found_field === undefined) {
    throw new HttpException(
      'Cancha no encontrado',
      HttpStatus.NOT_FOUND,
    );
  }

  return found_field;
  }

  async deleteField(id: string) {
const field:Field=await this.findById(id)
 // Actualizar el estado de todas las reservas asociadas a 'CANCELED'
 if (field.reservation && field.reservation.length > 0) {
  await Promise.all(
    field.reservation.map((reservation) => {
      reservation.status = ReservationStatus.CANCELLED;
      return this.reservationRepository.save(reservation);
    }),
  );


//Se tiene que enviar un mail aca avisando a los usuarios de la cancelacion 


  const deletion_result:Field|undefined=await this.fieldRepository.deleteField(field)

  if(!deletion_result){
    throw new InternalServerErrorException('Ocurrio un error al elimnar el campo')
  }
  return {
    message:'Field eliminado correctamente'
  }

}
  }
}
