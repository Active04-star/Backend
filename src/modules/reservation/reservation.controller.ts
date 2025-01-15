import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Reservation_Service } from './reservation.service';
import { CreateReservationDto } from 'src/dtos/reservation/reservation-create.dto';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { Reservation } from 'src/entities/reservation.entity';

@ApiTags('Reservation')
@Controller('reservation')
export class Reservation_Controller {
  constructor(private readonly reservationService: Reservation_Service) { }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Registra una nueva reserva',
    description: 'Crea una nueva reserva en el sistema',
  })
  @ApiBody({
    description: 'Datos para la creacion de la reserva',
    type: CreateReservationDto,
  })
  async createReservation(@Body() data: CreateReservationDto): Promise<{ message: string }> {
    return await this.reservationService.createReservation(data);
  }


  @Put('cancel/:id')
  @Roles(UserRole.USER, UserRole.MAIN_MANAGER, UserRole.MANAGER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Cambia el estado de la reserva a CANCELLED',
    description: 'Modifica una reserva y la guarda en el sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva a cancelar',
    example: 'a3e3b2d0-4321-7856-0191-adecef103556',
  })
  async cancelReservation(@Param('id', ParseUUIDPipe) id: string): Promise<Reservation> {
    return await this.reservationService.cancelReservation(id)
  }


  @Get(":id")
  @ApiOperation({
    summary: "obtiene todas las reservas de un usuario"
  })
  @ApiParam({
    name: 'id',
    description: 'ID de usuario',
  })
  async getReservations(@Param("id", ParseUUIDPipe) id: string): Promise<Reservation[]> {
    return await this.reservationService.getReservationUser(id);
  }

  // //en caso de modificar la fecha de la reserva, tener en cuenta el limite de tiempo necesario para esto
  // @Put('update')
  // @ApiOperation({
  //     summary: 'Modifica el dia u horario de la reserva',
  //     description: 'modifica el horario de una resrva por id'
  // })
  // @ApiBody({
  //     description: 'Datos necesarios para modificar la reserva',
  //     type: reservationUpdate
  // })
  // async updateReservation(@Body() data: reservationUpdate): Promise<void> {
  //     const {reservationId} = data
  //     return await this.reservationService.updateReservation(reservationId, data)
  // }
}
