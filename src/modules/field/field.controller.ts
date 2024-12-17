import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Field_Service } from './field.service';
import { FieldDto } from 'src/dtos/field/createField.dto';
import { UpdateFieldDto } from 'src/dtos/field/updateField.dto';
import { Field } from 'src/entities/field.entity';

@ApiTags('Field')
@Controller('field')
export class Field_Controller {
  constructor(private readonly fieldService: Field_Service) {}

  @Post()
  // @Roles(UserRole.MANAGER)
  // @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Registra una nueva cancha',
    description: 'Crea un nuevo registro de Field en el sistema.',
  })
  @ApiBody({
    description: 'Datos necesarios para crear una nueva cancha',
    type: FieldDto,
  })
  async createField(@Body() fieldData: FieldDto) {
    return await this.fieldService.createField(fieldData);
  }

  @Put('update')
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
  @ApiBody({
    description: 'Datos necesarios para actualizar un Field',
    type: UpdateFieldDto,
  })
  async updateField(@Body() data: UpdateFieldDto): Promise<Field> {
    return await this.fieldService.updateField(data);
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
