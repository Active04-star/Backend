import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Field } from 'src/entities/field.entity';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
import { SportCenterService } from 'src/modules/sport-center/sport-center.service';
import { ManagerService } from './manager.service';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { Reservation_Service } from '../reservation/reservation.service';
import { Reservation } from 'src/entities/reservation.entity';

@Controller('manager')
export class ManagerController{

  constructor(
    private readonly managerService: ManagerService,
    private sportCenterService: SportCenterService,
    private reservationService: Reservation_Service,
  ) {}

  @Get('center/:id')
  @Roles(UserRole.MAIN_MANAGER, UserRole.MANAGER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtiene el ID del centro deportivo que administra un usuario',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de usuario',
  })
  async getManagerSportCenter(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SportCenter> {
    return await this.managerService.getManagerSportCenter(id);
  }

  @Get('fields/:id')
  @Roles(UserRole.MAIN_MANAGER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'obtiene una lista de las canchas',
    description:
      'Proporciona toda la información de las canchas del centro deportivo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del centro deportivo',
    example: '936c7033-6020-41da-be01-d50b42250018',
  })
  async getFields(@Param('id', ParseUUIDPipe) id: string): Promise<Field[]> {
    return await this.managerService.getManagerFields(id);
  }

  @Get('reservations/:id')
  @Roles(UserRole.MAIN_MANAGER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'obtiene una lista de las reservas de una cancha ',
    description:
      'Proporciona toda la información de las canchas del centro deportivo a cargo del usuario',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario con rol manager',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async getReservations(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Reservation[]> {
    return await this.managerService.getManagerReservations(id);
  }

  @Put('update-sportcenter/:id')
  @Roles(UserRole.MAIN_MANAGER)
  @UseGuards(AuthGuard)
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
    return await this.sportCenterService.updateSportCenter(id, data);
  }

  @Put('reservation/complete/:id')
  @Roles(UserRole.MAIN_MANAGER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'completa una reserva por su ID',
    description: 'Permite cambiar el estado de la resreva a completed',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async activeReservation(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Reservation> {
    return await this.reservationService.completeReservation(id);
  }

  @Put('sportcenter/publish/:id')
  @Roles(UserRole.MAIN_MANAGER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Activa un SportCenter (todavia no esta implementado, se va a usar para que se asegure que el centro ya tenga un horario asignado y canchas mas deportes y no se vea en el feed vacio',
    description: 'Activa un centro deportivo asociado a un usuario.',
  })
  async publishSportCenter(@Param('id', ParseUUIDPipe) id: string) {
    console.log(id);
    
    return await this.managerService.publishSportCenter(id);
  }
}
