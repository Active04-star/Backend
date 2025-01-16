import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Sport_Category_Service } from './sport-category.service';
import { CreateSportCategoryDto } from 'src/dtos/sportcategory/createSportCategory.dto';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';

@ApiTags('Categories')
@Controller('categories')
export class Sport_Category_Controller {

  constructor(private readonly categoryService: Sport_Category_Service) { }


  @Post('create')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Registra un nuevo deporte',
    description:
      'Crea una nueva categoria (solo el admin deberia poder hacer esto)',
  })
  @ApiBody({ description: 'Datos necesarios para crear un nuevo deporte', type: CreateSportCategoryDto })
  async create(@Body() data: CreateSportCategoryDto): Promise<Sport_Category> {
    return await this.categoryService.createSportCategory(data);
  }


  @Get('all')
  @ApiOperation({
    summary: 'Obtiene lista de deportes ordenados alfabeticamente',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Palabra de busqueda',
  })
  async filterSportCategories(@Query('search') search?: string): Promise<Sport_Category[]> {
    return await this.categoryService.filterSportCategories(search);
  }


  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene un deporte por su ID',
    description: 'Proporciona toda la información de un Deporte.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del Sport_Category que se desea obtener',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Sport_Category> {
    return await this.categoryService.findById(id);
  }


  //! NO SE SI SE VAYA A USAR, ES COMPLICADO
  // @Delete(':id')
  // // @ApiBearerAuth()
  // // @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  // // @UseGuards(AuthGuard)
  // @ApiOperation({
  //   summary: 'Elimina un deporte',
  //   description: 'recibe el id del deporte por parametro y lo remueve',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'ID del Sport_Category que se desea eliminar',
  //   example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  // })
  // async deleteSportCategory(@Param('id', ParseUUIDPipe) id: string) {
  //   return await this.sport_category_service.deleteSportCategory(id);
  // }
}
