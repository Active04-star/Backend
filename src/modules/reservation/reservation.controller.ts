import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Reservation } from 'src/entities/reservation.entity';
import { Reservation_Service } from './reservation.service';
import { createReservationDto } from 'src/dtos/reservation/reservation-create.dto';
import { reservationResponse } from 'src/dtos/reservation/reservation-response.dto';

@ApiTags("Reservation")
@Controller('reservation')
export class Reservation_Controller {
    constructor(private readonly reservationService: Reservation_Service) {}

    @Get('user/:id')
    @ApiOperation({ summary: 'obtine una reserva por id de usuario'})
    async getReservationUser(@Param('id', ParseUUIDPipe) id: string): Promise<Reservation[]> {
        return this.reservationService.getReservationUser(id)
    }



    @Get('getreservation/:id')
    @ApiOperation({summary: 'obtiene una reserva por el id de la misma'})/*  */
    async getReservationById(@Param('id', ParseUUIDPipe) id: string): Promise<Reservation> {
        return this.reservationService.getReservationById(id)
    }


     @Post('create')
     @ApiOperation({
        summary: 'Registra una nueva reserva',
        description: 'Crea una nueva reserva en el sistema'
     })
    @ApiBody({
        description: 'Datos para la creacion de la reserva',
        schema: {
            example: {
                sportcenterId: 'e3d5c8f0-1234-5678-9101-abcdef123456',
                sportType: '',
                reservationDate: '',
                timeSlot: '',
            }
       }
    })
    async createReservation(@Body() data: createReservationDto): Promise<{message: string}> {
       return await this.reservationService.createReservation(data);
    }

    @Put('cancel/:id')
    @ApiOperation({
        summary: 'Cambia el estado de la reserva a CANCELLED',
        description: 'Modifica una reserva y la guarda en el sistema',
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la reserva a cancelar',
        example: 'a3e3b2d0-4321-7856-0191-adecef103556',
    })
    async cancelReservation(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return await this.reservationService.cancelReservation(id)
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