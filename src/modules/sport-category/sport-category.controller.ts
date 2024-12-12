import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Sport_Category_Service } from './sport-category.service';
import { CreateSportCategoryDto } from 'src/dtos/sportcategory/createSportCategory.dto';
import { Sport_Category } from 'src/entities/sport_category.entity';

@ApiTags('Sport Categories')
@Controller('sportCategories')
export class Sport_Category_Controller {
  constructor(
    private readonly sport_category_service: Sport_Category_Service,
  ) {}

  @Post('create/:sportCenterId')
  //   @Roles(UserRole.CONSUMER,UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Registra un nuevo deporte',
    description: 'Crea un nuevo registro de Sport_Cateogry en el sistema.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo deporte',
    type: CreateSportCategoryDto,
  })
  @ApiParam({
    name: 'sportCenterId',
    description:
      'ID del SportCenter para sincronizar el deporte con el centro deportivo',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async create(
    @Param('sportCenterId', ParseUUIDPipe) sportCenterId: string,
    @Body() data: CreateSportCategoryDto,
  ): Promise<Sport_Category> {
    return await this.sport_category_service.createSportCategory(
      sportCenterId,
      data,
    );
  }
}
