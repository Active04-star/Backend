import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Put, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserClean } from "src/dtos/user/user-clean.dto";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { isNotEmpty, isNotEmptyObject } from "class-validator";
import { UpdateUser } from "src/dtos/user/update-user.dto";
import { ApiError } from "src/helpers/api-error-class";
import { UserList } from "src/dtos/user/users-list.dto";
import { User } from "src/entities/user.entity";
import { AdminService } from "./admin.service";
import { SportCenterList } from "src/dtos/sportcenter/sport-center-list.dto";
import { SportCenterService } from "../sport-center/sport-center.service";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
    constructor( private readonly sportCenterService: SportCenterService,
        private readonly adminService: AdminService) { }

    @Get('list/user')
    @ApiQuery({ name: 'page', required: true, type: Number, example: 1, description: 'Numero de la pagina' })
    @ApiQuery({ name: 'limit', required: true, type: Number, example: 10, description: 'Objetos por pagina' })
    @ApiOperation({ summary: 'Obtiene una lista de usuarios', description: 'debe ser ejecutado por un usuario con rol admin' })
    async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<UserList> {
        return await this.adminService.getUsers(page, limit);
    }

    @Get('list/centerBan')
    @ApiQuery({ name: 'page', required: true, type: Number, example: 1, description: 'Numero de la pagina' })
    @ApiQuery({ name: 'limit', required: true, type: Number, example: 10, description: 'Objetos por pagina' })
    @ApiQuery({ name: "rating", required: false, type: Number, example: 5, description: "Rating de centros deportivos" })
    @ApiQuery({ name: "search", required: false, type: String, description: "Palabra de busqueda" })
    @ApiOperation({ summary: 'Obtiene lista de sportcenter no publicados ordenados por rating de mayor a menor' })
    async getSportCenters(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query("rating") rating?: number, @Query("search") search?: string): Promise<SportCenterList> {
      return await this.sportCenterService.getSportCenters(page, limit, true, rating, search);
    }


    @Put('ban-unban/user/:id')
    @ApiOperation({
        summary: 'Banea o desbanea con un softdelete',
        description:
            'recibe el id de un usuario por parametro y actualiza el estado was_banned del usuario',
    })
    async banOrUnbanUser(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: ApiStatusEnum }> {
        return this.adminService.banOrUnbanUser(id);
    }

    @Put('ban-unban/sportcenter/:id')
    @ApiOperation({
        summary: 'Banea o desbanea con un softdelete',
        description: 'recibe el id del sportcenter y actualiza su estado sportCenterStatus',
    })
    @ApiBody({
        description: 'Nuevo estado del sportcenter',
        schema: {
            type: 'object',
            properties: {
               status: {
                type: 'enum',
                examples: {
                   published: { value: 'published'},
                   disable: { value: 'disable'},
                   banned: { value: 'banned'},
                }
                }
            } 
        }
    })
    async banOrBanCenter(@Param('id', ParseUUIDPipe) id: string): Promise<{message: ApiStatusEnum}> {
        return this.adminService.banOrUnbanUser(id);
    }
         
}