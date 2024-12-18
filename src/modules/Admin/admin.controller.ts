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

@ApiTags("User")
@Controller("user")
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('list')
    @ApiQuery({ name: 'page', required: true, type: Number, example: 1, description: 'Numero de la pagina' })
    @ApiQuery({ name: 'limit', required: true, type: Number, example: 10, description: 'Objetos por pagina' })
    @ApiOperation({ summary: 'Obtiene una lista de usuarios', description: 'debe ser ejecutado por un usuario con rol admin' })
    async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<UserList> {
        return await this.adminService.getUsers(page, limit);
    }

    @Put('ban-unban/:id')
    @ApiOperation({
        summary: 'Banea o desbanea con un softdelete',
        description:
            'recibe el id de un usuario por parametro y actualiza el estado was_banned del usuario',
    })
    async banOrUnbanUser(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: ApiStatusEnum }> {
        return this.adminService.banOrUnbanUser(id);
    }


}