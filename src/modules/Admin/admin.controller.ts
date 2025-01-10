import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { UserList } from 'src/dtos/user/users-list.dto';
import { AdminService } from './admin.service';
import { SportCenterList } from 'src/dtos/sportcenter/sport-center-list.dto';
import { SportCenterService } from '../sport-center/sport-center.service';
import { Sport_Center_Status } from 'src/enums/sport_Center_Status.enum';
// import { UserRole } from 'src/enums/roles.enum';
// import { AuthGuard } from 'src/guards/auth-guard.guard';
// import { RolesGuard } from 'src/guards/roles.guard';
// import { filterDatedto } from 'src/dtos/filter_date/filterDate.dto';
import { reservationList } from 'src/dtos/reservation/reservation-list.dto';


@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly sportCenterService: SportCenterService,
    private readonly adminService: AdminService,
  ) {}

  @Get('list/user')
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
  @ApiOperation({
    summary: 'Obtiene una lista de usuarios',
    description: 'debe ser ejecutado por un usuario con rol admin',
  })
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<UserList> {
    return await this.adminService.getUsers(page, limit);
  }

  @Get('list/centersban')
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
      'Obtiene lista de sportcenter no publicados ordenados por rating de mayor a menor',
  })
  async getSportCenters(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('rating') rating?: number,
    @Query('search') search?: string,
  ): Promise<SportCenterList> {
    return await this.sportCenterService.getSportCenters(
      page,
      limit,
      true,
      rating,
      search,
    );
  }

  @Put('ban-unban/user/:id')
  @ApiOperation({
    summary: 'Banea o desbanea con un softdelete',
    description:
      'recibe el id de un usuario por parametro y actualiza el estado was_banned del usuario',
  })
  async banOrUnbanUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: ApiStatusEnum }> {
    return await this.adminService.banOrUnbanUser(id);
  }

  @Put('ban-unban/sportcenter/:id')
  @ApiOperation({
    summary: 'Banea o desbanea con un softdelete',
    description:
      'recibe el id del sportcenter y actualiza su estado sportCenterStatus',
  })
  @ApiBody({
    description: 'Nuevo estado del sportcenter',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'enum',
          examples: {
            published: { value: 'published' },
            disable: { value: 'disable' },
            banned: { value: 'banned' },
          },
        },
      },
    },
  })
  async banOrUnbanCenter(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: Sport_Center_Status },
  ): Promise<{ message: ApiStatusEnum }> {
    return await this.adminService.banOrUnbanCenter(id, body.status);
  }

  @Put('force.ban/:id')
  @ApiOperation({
    summary: 'fuerza el ban de un sportcenter',
    description:
      'recibe el id del sportcenter y actualiza su estado sportCenterStatus',
  })
  @ApiBody({
    description: 'Nuevo estado del sportcenter',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'enum',
          examples: {
            disable: { value: 'disable' },
            banned: { value: 'banned' },
          },
        },
      },
    },
  })
  async forceBan(
    @Param('id', ParseUUIDPipe) id: string,
    body: { status: Sport_Center_Status },
  ): Promise<{ message: ApiStatusEnum }> {
    return await this.adminService.forceBan(id, body.status);
  }


  @Get('list/reservation')
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
    name: 'startDate', 
    required: true, 
    type: String, 
    description: 'Fecha de inicio (formato: YYYY-MM-DD)'})
  @ApiQuery({ 
    name: 'endDate', 
    required: true, 
    type: String, 
    description: 'Fecha de fin (formato: YYYY-MM-DD)' })
  @ApiOperation({
    summary: 'Obtiene una lista de reservas creadas en el tiempo establecido',
    description: 'debe ser ejecutado por un usuario con rol admin',
  })
  async getUsersByDate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<reservationList> {
    return await this.adminService.getReservationByDate(page, limit, startDate, endDate);
  }

//RUTA PARA PROMOVER CREAR USUARIOS ADMIN
//   @Put('changeAdmin/:id')
//   @Roles(UserRole.ADMIN)
//   @UseGuards(AuthGuard,RolesGuard)
//  async promoteUser(@Param('id', ParseUUIDPipe) id: string) {
//     return this.adminService.promoteUser(id);
//   }

}