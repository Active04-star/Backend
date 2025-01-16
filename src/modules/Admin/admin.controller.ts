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
  ApiBearerAuth,
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
import { UserRole } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { ReservationList } from 'src/dtos/reservation/reservation-list.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateStatusDto } from 'src/dtos/sportcenter/update-status.dto';
import { User } from 'src/entities/user.entity';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {

  constructor(
    private readonly sportCenterService: SportCenterService,
    private readonly adminService: AdminService,
  ) { }

  @Get('list/user')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Palabra de busqueda',
  })
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
  async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query("search") search?: string): Promise<UserList> {
    return await this.adminService.getUsers(page, limit, search);
  }


  @Get("users/total")
  @ApiOperation({
    summary: 'Consigue el total de usuarios registrados sin incluir admins',
    description: "Util para verificacion de paginado"
  })
  async getTotalUsers(): Promise<{ total: number }> {
    return await this.adminService.getTotalUsers();
  }


  @Get('premiumUsers')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Obtiene un array de usuarios premium',
    description: 'debe ser ejecutado por un usuario con rol admin',
  })
  async getPremiumUsers(): Promise<User[]> {
    return await this.adminService.getPremiumUsers();
  }

  @Get('list/centersban')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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
      'Obtiene lista de sportcenter publicados o no publicados ordenados por rating de mayor a menor',
  })
  async getSportCenters(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('rating') rating?: number, @Query('search') search?: string,): Promise<SportCenterList> {
    return await this.sportCenterService.getSportCenters(page, limit, true, rating, search,);
  }

  @Put('ban-unban/user/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Banea o desbanea con un softdelete',
    description:
      'recibe el id del sportcenter y actualiza su estado sportCenterStatus',
  })
  @ApiBody({
    description: 'Nuevo estado del sportcenter',
    type: UpdateStatusDto,
  })
  async banOrUnbanCenter(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: Sport_Center_Status },
  ): Promise<{ message: ApiStatusEnum }> {
    return await this.adminService.banOrUnbanCenter(id, body.status);
  }


  @Put('force-ban/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'fuerza el ban de un sportcenter',
    description:
      'recibe el id del sportcenter y actualiza su estado sportCenterStatus',
  })
  async forceBan(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: ApiStatusEnum }> {
    return await this.adminService.forceBan(id);
  }

  
  @Get('list/reservation')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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
    description: 'Fecha de inicio (formato: YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description: 'Fecha de fin (formato: YYYY-MM-DD)',
  })
  @ApiOperation({
    summary: 'Obtiene una lista de reservas creadas en el tiempo establecido',
    description: 'debe ser ejecutado por un usuario con rol admin',
  })
  async getUsersByDate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ReservationList> {
    return await this.adminService.getReservationByDate(
      page,
      limit,
      startDate,
      endDate,
    );
  }
}
