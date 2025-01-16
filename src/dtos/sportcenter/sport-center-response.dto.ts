import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SportCenter } from 'src/entities/sportcenter.entity';

export class SportCenterResponseDto extends PickType(SportCenter, ['id', 'name', 'address', 'averageRating', 'isDeleted', 'status','photos','schedules','fields',"latitude","longitude"] as const) {}