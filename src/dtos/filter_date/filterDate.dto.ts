import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class filterDatedto {

  @IsNotEmpty()
  @IsString()
  startDate: Date;

  @IsNotEmpty()
  @IsString()
  endDate: Date;
}
