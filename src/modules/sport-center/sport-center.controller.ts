import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SportCenterService } from './sport-center.service';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
import { SportCenterList } from 'src/dtos/sportcenter/sport-center-list.dto';
import { ApiResponse } from 'src/dtos/api-response';
import { SportCenterStatus } from 'src/enums/sportCenterStatus.enum';

@ApiTags('Sport Center')
@Controller('sportcenter')
export class SportCenterController {
  constructor(private readonly sportcenterService: SportCenterService) { }


  @Get("search")
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1, description: 'Numero de la pagina' })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10, description: 'Objetos por pagina' })
  @ApiQuery({ name: "rating", required: false, type: Number, example: 5, description: "Rating de centros deportivos" })
  @ApiQuery({ name: "search", required: false, type: String, description: "Palabra de busqueda" })
  @ApiOperation({ summary: 'Obtiene lista de sportcenter ordenados por rating de mayor a menor' })
  async getSportCenters(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query("rating") rating?: number, @Query("search") search?: string): Promise<SportCenterList> {
    return await this.sportcenterService.getSportCenters(page, limit, false, rating, search);
  }

  
  @Post('create')
  //   @Roles(UserRole.CONSUMER)
  //   @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Registra un nuevo centro deportivo',
    description: 'Crea un nuevo registro de SportCenter en el sistema.',
  })
  @ApiBody({ description: 'Datos necesarios para crear un nuevo SportCenter', type: CreateSportCenterDto })
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
    return await this.sportcenterService.getById(id);
  }

  /**
   * SE VA A HACER AUTOMATICAMENTE AL AGREGAR UNA CANCHA
   */
  // @Post('assign-categories/:id')
  // @ApiOperation({
  //   summary: 'Asigna categorías a un centro deportivo',
  //   description: 'Permite asignar categorías específicas a un centro deportivo.',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'ID del SportCenter',
  //   example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  // })
  // @ApiBody({
  //   description: 'Lista de categorías a asignar',
  //   type: [String],
  //   examples: {
  //     example1: {
  //       value: ['Fútbol', 'Basketball', 'Natación'],
  //     },
  //   },
  // })
  // async assignCategoriesToSportCenter(@Param('id') sportCenterId: string, @Body('categories') categories: string[]) {
  //   return await this.sportcenterService.assignCategoriesToSportCenter(categories, sportCenterId)
  // }


  @Put('update/:id')
  //   @Roles(UserRole.CONSUMER,UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualiza un SportCenter por su ID',
    description: 'Permite actualizar los datos de un SportCenter existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del SportCenter a actualizar',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  @ApiBody({ description: 'Datos necesarios para actualizar un SportCenter', type: UpdateSportCenterDto })
  async updateSportCenter(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateSportCenterDto) {
    return await this.sportcenterService.updateSportCenter(id, data);
  }


  @Put('disable/:sportCenterId/:userId')
  //   @Roles(UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Desactiva un SportCenter',
    description: 'Desactiva un centro deportivo asociado a un usuario.',
  })
  @ApiParam({
    name: 'sportCenterId',
    description: 'ID del SportCenter a desactivar',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario asociado al SportCenter',
    example: 'a1b2c3d4-5678-9101-1121-abcdef654321',
  })
  async disableSportCenter(@Param('userId', ParseUUIDPipe) userId: string, @Param('sportCenterId', ParseUUIDPipe) sportCenterId: string) {
    return await this.sportcenterService.updateStatus(userId, sportCenterId, SportCenterStatus.DISABLE);
  }


  @Put('publish/:sportCenterId/:userId')
  //   @Roles(UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Activa un SportCenter (No se va a usar, queda como extra)',
    description: 'Activa un centro deportivo asociado a un usuario.',
  })
  @ApiParam({
    name: 'sportCenterId',
    description: 'ID del SportCenter a activar',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario asociado al SportCenter',
    example: 'a1b2c3d4-5678-9101-1121-abcdef654321',
  })
  async publishSportCenter(@Param('userId', ParseUUIDPipe) userId: string, @Param('sportCenterId', ParseUUIDPipe) sportCenterId: string) {
    return await this.sportcenterService.updateStatus(userId, sportCenterId, SportCenterStatus.PUBLISHED);
  }


  @Delete('ban-unban/:id')
  //   @Roles(UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Elimina un Centro deportivo',
    description:
      'Esta ruta permite eliminar un centro deportivo (SportCenter) de la base de datos. Si el usuario que lo gestiona (manager) tiene el rol de MANAGER, su rol puede ser afectado dependiendo del estado del SportCenter eliminado y de los otros SportCenters que gestione.El rol del manager solo se modifica si, tras la eliminación, no tiene otros centros en estado PUBLISHED o DISABLE.',
  })
  @ApiParam({ name: 'id', description: 'ID del Centro deportivo a eliminar', example: 'e3d5c8f0-1234-5678-9101-abcdef123456' })
  async banOrUnBanCenter(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponse> {
    return await this.sportcenterService.banOrUnBanCenter(id);
  }

}
