import { Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SportCenterService } from './sport-center.service';

@ApiTags('Sport_Center')
@Controller('sportcenter')
export class SportCenterController {
  constructor(private readonly sportcenterService: SportCenterService) {}


  @Post('create')
//   @Roles(UserRole.CONSUMER)
//   @UseGuards(AuthGuard)
//   @ApiBearerAuth()
async createSportCenter(){}


}
