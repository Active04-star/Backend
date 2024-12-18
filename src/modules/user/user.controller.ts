import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserClean } from "src/dtos/user/user-clean.dto";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { isNotEmpty, isNotEmptyObject } from "class-validator";
import { UpdateUser } from "src/dtos/user/update-user.dto";
import { ApiError } from "src/helpers/api-error-class";
import { UserList } from "src/dtos/user/users-list.dto";
import { User } from "src/entities/user.entity";

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Get('list')
    @ApiQuery({ name: 'page', required: true, type: Number, example: 1, description: 'Numero de la pagina' })
    @ApiQuery({ name: 'limit', required: true, type: Number, example: 10, description: 'Objetos por pagina' })
    @ApiOperation({ summary: 'Obtiene una lista de usuarios', description: 'debe ser ejecutado por un usuario con rol admin' })
    async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<UserList> {
        return await this.userService.getUsers(page, limit);
    }


    @Put('ban-unban/:id')
    @ApiOperation({
        summary: 'Banea o desbanea con un softdelete',
        description:
            'recibe el id de un usuario por parametro y actualiza el estado was_banned del usuario',
    })
    async banOrUnbanUser(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: ApiStatusEnum }> {
        return this.userService.banOrUnbanUser(id);
    }


    @Put(':id')
    @ApiOperation({
        summary: 'actualiza la informacion de un usuario, por id y body',
        description: 'uuid de user y objeto a actualizar (por ahora solo con nombre)(Nota: Aqui no deberia actualizarse la imagen de perfil)',
    })
    @ApiBody({
        type: UpdateUser,
    })
    async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() modified_user: UpdateUser): Promise<UserClean> {

        if (!isNotEmptyObject(modified_user)) {
            throw new ApiError(ApiStatusEnum.USER_UPDATE_FAILED, BadRequestException, "body values are empty");
        }

        if (isNotEmpty(modified_user.password)) {
            throw new ApiError(ApiStatusEnum.USER_UPDATE_FAILED, BadRequestException, "Password can't be updated from this endpoint");
        }

        return await this.userService.updateUser(id, modified_user);
    }

    @Get("solo-para-testing/:id")
    @ApiParam({
        name: "id",
        description: 'ID de usuario',
    })
    async getUserById(@Param("id", ParseUUIDPipe) id: string): Promise<User> {
        return await this.getUserById(id);
    }

}