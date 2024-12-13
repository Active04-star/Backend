import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SportCenterService } from './sport-center.service';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';

@ApiTags('Sport Center')
@Controller('sportcenter')
export class SportCenterController {
  constructor(private readonly sportcenterService: SportCenterService) {}

  @Get()
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
  @ApiQuery({ name: "rating", required: false, type: Number, example: 5, description: "Rating de centros deportivos" })
  @ApiQuery({ name: "search", required: false, type: String, description: "Palabra de busqueda" })
  @ApiOperation({
    summary:
      'Obtiene lista de sportcenter ordenados por rating de mayor a menor',
  })
  async getSportCenters(
    @Query('page') page: number=1,
    @Query('limit') limit: number=10,
    @Query("rating") rating?: number, @Query("search") search?: string
  ) {
    return await this.sportcenterService.getSportCenters(page,limit,rating,search);
  }

  @Post('create')
  //   @Roles(UserRole.CONSUMER)
  //   @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Registra un nuevo centro deportivo',
    description: 'Crea un nuevo registro de SportCenter en el sistema.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo SportCenter',
    type: CreateSportCenterDto,
  })
  async createSportCenter(
    @Body() data: CreateSportCenterDto,
  ): Promise<SportCenter> {
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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.sportcenterService.findOne(id);
  }

  @Put('update/:id')
  //   @Roles(UserRole.CONSUMER,UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualiza un SportCenter por su ID',
    description: 'Permite actualizar los datos de un SportCenter existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del SportCenter a actualizar',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  @ApiBody({
    description: 'Datos necesarios para actualizar un SportCenter',
    type: UpdateSportCenterDto,
  })
  async updateSportCenter(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateSportCenterDto,
  ) {
    return await this.sportcenterService.updateSportCenter(id, data);
  }

  @Put('disable/:sportCenterId/:userId')
  //   @Roles(UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
  async disableSportCenter(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('sportCenterId', ParseUUIDPipe) sportCenterId: string,
  ) {
    return await this.sportcenterService.disableSportCenter(
      userId,
      sportCenterId,
    );
  }

  @Put('active/:sportCenterId/:userId')
  //   @Roles(UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Activa un SportCenter',
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
  async publishSportCenter(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('sportCenterId', ParseUUIDPipe) sportCenterId: string,
  ) {
    return await this.sportcenterService.publishSportCenter(
      userId,
      sportCenterId,
    );
  }

  @Delete(':id')
  //   @Roles(UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Elimina un Centro deportivo',
    description:
      'Esta ruta permite eliminar un centro deportivo (SportCenter) de la base de datos. Si el usuario que lo gestiona (manager) tiene el rol de MANAGER, su rol puede ser afectado dependiendo del estado del SportCenter eliminado y de los otros SportCenters que gestione.El rol del manager solo se modifica si, tras la eliminación, no tiene otros centros en estado PUBLISHED o DISABLE.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del Centro deportivo a eliminar',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async deleteSportCenter(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.sportcenterService.deleteSportCenter(id);
  }
}
