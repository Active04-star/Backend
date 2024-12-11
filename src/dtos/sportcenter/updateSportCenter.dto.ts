import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSportCenterDto } from './createSportCenter.dto';

export class UpdateSportCenterDto extends PartialType(
  OmitType(CreateSportCenterDto, ['photos', 'manager'] as const),
) {}
