import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserClean } from "src/dtos/user/user-clean.dto";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { isNotEmpty, isNotEmptyObject } from "class-validator";
import { UpdateUser } from "src/dtos/user/update-user.dto";
import { ApiError } from "src/helpers/api-error-class";
import { User } from "src/entities/user.entity";
import { AuthGuard } from "src/guards/auth-guard.guard";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/roles.enum";

@ApiTags("User")
@Controller("user")
export class UserController {

    constructor(private readonly userService: UserService) { }


    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER, UserRole.MAIN_MANAGER)
    @ApiParam({ name: "id", description: 'ID de usuario' })
    @ApiOperation({
        summary: 'actualiza la informacion de un usuario, por id y body',
        description: 'uuid de user y objeto a actualizar (por ahora solo con nombre)(Nota: Aqui no deberia actualizarse la imagen de perfil ni la contraseña)',
    })
    @ApiBody({
        type: UpdateUser,
    })
    async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() modified_user: UpdateUser): Promise<UserClean> {
        console.log(modified_user);

        if (!isNotEmptyObject(modified_user)) {
            throw new ApiError(ApiStatusEnum.USER_UPDATE_FAILED, BadRequestException, "body values are empty");
        }

        if (isNotEmpty(modified_user.password)) {
            throw new ApiError(ApiStatusEnum.USER_UPDATE_FAILED, BadRequestException, "Password can't be updated from this endpoint");
        }

        return await this.userService.updateUser(id, modified_user);
    }


    @Get("center/:id")
    @ApiOperation({ summary: 'Obtiene el ID del centro deportivo que administra un usuario' })
    @ApiParam({
        name: "id",
        description: 'ID de usuario',
    })
    async getManagerSportCenter(@Param("id", ParseUUIDPipe) id: string): Promise<{ id: string }> {
        return await this.userService.getManagerSportCenter(id);
    }


    @Get("solo-para-testing/:id")
    @ApiParam({
        name: "id",
        description: 'ID de usuario',
    })
    async getUserById(@Param("id", ParseUUIDPipe) id: string): Promise<User> {
        return await this.userService.getUserById(id);
    }

}