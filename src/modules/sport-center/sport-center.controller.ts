import { Body, Controller, Get, Param, ParseBoolPipe, ParseUUIDPipe, Post, Query, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags, } from '@nestjs/swagger';
import { SportCenterService } from './sport-center.service';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { SportCenterList } from 'src/dtos/sportcenter/sport-center-list.dto';
import { AuthGuard } from 'src/guards/auth-guard.guard';

@ApiTags('Sport Center')
@Controller('sportcenter')
export class SportCenterController {

  constructor(private readonly sportcenterService: SportCenterService) { }

  @Get('search')
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
    description: 'Numero de la pagina',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    example: 10,
    description: 'Objetos por pagina',
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    type: Number,
    example: 5,
    description: 'Rating de centros deportivos',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Palabra de busqueda',
  })
  @ApiOperation({
    summary:
      'Obtiene lista de sportcenter ordenados por rating de mayor a menor',
  })
  async getSportCenters(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('rating') rating?: number, @Query('search') search?: string,): Promise<SportCenterList> {
    return await this.sportcenterService.getSportCenters(page, limit, false, rating, search,);
  }


  @Get("total/:hidden")
  @ApiParam({
    name: "hidden",
    description: "Marcar true para conseguir el total incluyendo centros baneados",
    type: Boolean
  })
  @ApiOperation({
    summary: 'Consigue el total de canchas registradas hasta el momento',
    description: "Util para verificacion de paginado"
  })
  async getTotalCenters(@Param("hidden", ParseBoolPipe) hidden: boolean): Promise<{ total: number }> {
    return await this.sportcenterService.getTotalCenters(hidden);
  }
  
 
  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Registra un nuevo centro deportivo',
    description: 'Crea un nuevo registro de SportCenter en el sistema.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo SportCenter',
    type: CreateSportCenterDto,
  })
  async createSportCenter(@Body() data: CreateSportCenterDto,): Promise<SportCenter> {
    return await this.sportcenterService.createSportCenter(data);
  }


  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene un Centro deportivo por su ID',
    description: 'Proporciona toda la información de un Centro específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del SportCenter que se desea obtener',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<SportCenter> {
    return await this.sportcenterService.getById(id, true);
  }

}
