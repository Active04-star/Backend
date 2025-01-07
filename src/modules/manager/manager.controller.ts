import {
  Body,
  Controller,
  Delete,
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
import { ApiResponse } from 'src/dtos/api-response';
import { ManagerService } from './manager.service';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('manager')
export class ManagerController {
  constructor(
    private readonly managerService: ManagerService,
    private sportCenterService: SportCenterService,
  ) {}

  @Get('center/:id')
  @Roles(UserRole.MAIN_MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
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

  @Get('fields/:centerId')
  // @Roles(UserRole.MANAGER)
  // @UseGuards(AuthGuard, RolesGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'optiene una lista de las canchas',
    description:
      'Proporciona toda la información de las canchas del centro deportivo',
  })
  @ApiParam({
    name: 'centerId',
    description: 'ID del centro deportivo',
    example: '936c7033-6020-41da-be01-d50b42250018',
  })
  async getFields(
    @Param('centerId', ParseUUIDPipe) centerId: string,
  ): Promise<Field[]> {
    return await this.managerService.getManagerFields(centerId);
  }

  @Get('reservations/:managerId')
  @Roles(UserRole.MANAGER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'obtiene una lista de las reservas de una cancha ',
    description:
      'Proporciona toda la información de las canchas del centro deportivo a cargo del usuario',
  })
  @ApiParam({
    name: 'managerId',
    description: 'ID del usuario con rol manager',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async getReservations(@Param('managerId', ParseUUIDPipe) managerId: string) {
    return await this.managerService.getManagerReservations(managerId);
  }

  @Put('update-sportcenter/:id')
  @Roles(UserRole.MANAGER)
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

  @Delete('ban-unban/:id')
  //   @Roles(UserRole.MANAGER)
  //   @UseGuards(AuthGuard)
  // @ApiBearerAuth()
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
  async banOrUnBanCenter(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse> {
    return await this.sportCenterService.banOrUnBanCenter(id);
  }

  @Put('publish/:sportCenterId/:userId')
  //   @Roles(UserRole.MAIN_MANAGER)
  //   @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Activa un SportCenter (todavia no esta implementado, se va a usar para que se asegure que el centro ya tenga un horario asignado y canchas mas deportes y no se vea en el feed vacio',
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
    return await this.managerService.publishSportCenter(userId, sportCenterId);
  }

  /**@Put('disable/:sportCenterId/:userId')
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
  async disableSportCenter(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('sportCenterId', ParseUUIDPipe) sportCenterId: string,
  ) {
    return await this.sportcenterService.updateStatus(
      userId,
      sportCenterId,
      Sport_Center_Status.DISABLE,
    );
  }
*/
}
