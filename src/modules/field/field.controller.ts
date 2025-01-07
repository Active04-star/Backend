import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Field_Service } from './field.service';
import { FieldDto } from 'src/dtos/field/createField.dto';
import { UpdateFieldDto } from 'src/dtos/field/updateField.dto';
import { Field } from 'src/entities/field.entity';
import { UserRole } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Field')
@Controller('field')
export class Field_Controller {
  constructor(private readonly fieldService: Field_Service) { }

  @Post()
  @Roles(UserRole.MANAGER, UserRole.MAIN_MANAGER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registra una nueva cancha', description: 'Crea un nuevo registro de Field en el sistema.' })
  @ApiBody({ description: 'Datos necesarios para crear una nueva cancha', type: FieldDto })
  async createField(@Body() fieldData: FieldDto): Promise<Field> {
    return await this.fieldService.createField(fieldData);
  }


  @Get('fields/:centerId')
  @ApiOperation({
    summary: 'obtiene una lista de las canchas, para el usuario',
    description:
      'Proporciona toda la información de las canchas del centro deportivo',
  })
  @ApiParam({
    name: 'centerId',
    description: 'ID del centro deportivo',
    example: '936c7033-6020-41da-be01-d50b42250018',
  })
  async getFields(@Param('centerId', ParseUUIDPipe) centerId: string): Promise<Field[]> {
    return await this.fieldService.getFields(centerId);
  }


  @Put('update/:id')
  // @Roles(UserRole.MANAGER)
  // @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualiza un Field por su ID',
    description: 'Permite actualizar los datos de un Field existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del Field a actualizar',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  @ApiBody({ description: 'Datos necesarios para actualizar un Field', type: UpdateFieldDto })
  async updateField(@Param("id", ParseUUIDPipe) id: string, @Body() data: UpdateFieldDto): Promise<Field> {
    return await this.fieldService.updateField(id, data);
  }


  @Delete(':id')
  @ApiBearerAuth()
  // @Roles(UserRole.MANAGER)
  // @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Elimina un field',
    description:
      'recibe el id del field por parametro y lo remueve, tambien cancela todas las reservas que tenga asociado ese field',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del Field que se desea eliminar',
    example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
  })
  async deleteField(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fieldService.deleteField(id);
  }

}
