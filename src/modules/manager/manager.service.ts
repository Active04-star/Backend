import { Injectable } from '@nestjs/common';
import { Field } from 'src/entities/field.entity';
import { Field_Service } from '../field/field.service';

@Injectable()
export class ManagerService {

  constructor(private fieldService: Field_Service) { }


  async getFields(centerId: string): Promise<Field[]> {
    return await this.fieldService.getFields(centerId);
  }


  async getReservations(managerId: string) {

  }

}