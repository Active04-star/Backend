import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isEmpty } from "class-validator";
import Decimal from "decimal.js";
import { FieldDto } from "src/dtos/field/createField.dto";
import { UpdateFieldDto } from "src/dtos/field/updateField.dto";
import { Field } from "src/entities/field.entity";
import { Sport_Category } from "src/entities/sport_category.entity";
import { SportCenter } from "src/entities/sportcenter.entity";
import { Repository } from "typeorm";

@Injectable()
export class Field_Repository {


  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) { }


async getFields(sportCenterId:string):Promise<Field[]>{
return await this.fieldRepository.find({where:{sportcenter:{id:sportCenterId},isDeleted:false},relations:['reservation','blocks','photos','reviews']})
}

  async updateField(field: Field, data: UpdateFieldDto): Promise<Field> {
    const updatedField = this.fieldRepository.merge(
      field,
      data,
    );

    return await this.fieldRepository.save(updatedField);
  }

  async findById(id: string): Promise<Field | undefined> {
    const field: Field | null = await this.fieldRepository.findOne({
      where: {
        id
      },
      relations:['reservation','blocks']
    });

    return field === null ? undefined : field;
  }


  async createField(sportCenter: SportCenter, sportCategory: Sport_Category, fieldData: FieldDto): Promise<Field> {
    const { price, ...rest } = fieldData;
    const saved_field: Field = await this.fieldRepository.save(this.fieldRepository.create({
      ...rest,
      sportcenter: sportCenter,
      sportCategory: sportCategory,
      price: new Decimal(price),
    }))

    return saved_field;

  }


  async deleteField(field: Field): Promise<Field | undefined> {
    console.log('field',field);
    
    const deletion_result: Field = await this.fieldRepository.remove(field);

    if (isEmpty(deletion_result)) {
      return undefined;
    }

    return deletion_result;
  }
















}