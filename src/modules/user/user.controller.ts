import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserClean } from "src/dtos/user/user-clean.dto";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { isNotEmpty, isNotEmptyObject } from "class-validator";
import { UpdateUser } from "src/dtos/user/update-user.dto";
import { ApiError } from "src/helpers/api-error-class";

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('all')
    // @ApiBearerAuth()
    // @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Obtiene una lista de usuarios',
        // description: 'debe ser ejecutado por un usuario con rol admin',
    })
    async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 100): Promise<UserClean[]> {
        return await this.userService.getUsers(page, limit);
    }

    @Put('ban-unban/:id')
    // @ApiBearerAuth()
    // @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Banea o desbanea con un softdelete',
        description:
            'recibe el id de un usuario por parametro y actualiza el estado was_banned del usuario',
    })
    async banOrUnbanUser(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: ApiStatusEnum }> {
        return this.userService.banOrUnbanUser(id);
    }

    @Put(':id')
    // @ApiBearerAuth()
    @ApiOperation({
        summary: 'actualiza la informacion de un usuario, por id y body',
        description: 'uuid de user y objeto a actualizar (por ahora solo funciona con nombre)',
    })
    @ApiBody({
        schema: {
            example: {
                name: 'Al paccino',
            },
        },
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

}