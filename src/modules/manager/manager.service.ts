import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from 'src/entities/field.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { User } from 'src/entities/user.entity';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ApiError } from 'src/helpers/api-error-class';
import { Repository } from 'typeorm';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SportCenter)
    private sportcenterRepository: Repository<SportCenter>,
  ) {}

  async getFields(userId: string) :Promise<Field[]>{
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
    }

    const sportCenter: SportCenter = await this.sportcenterRepository.findOne({
      where: { main_manager: { id: user.id } },relations:['fields']
    });


    if (!sportCenter) {
        throw new ApiError(ApiStatusEnum.CENTER_NOT_FOUND, NotFoundException);
      }
    
    return sportCenter.fields
  }


  async getReservations(managerId:string){

  }
}
