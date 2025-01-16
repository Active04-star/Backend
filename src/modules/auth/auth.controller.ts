import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags, PickType } from '@nestjs/swagger';
import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { UserLogin } from 'src/dtos/user/user-login.dto';
import { LoginResponse } from 'src/dtos/user/login-response.dto';
import { AuthRegister } from 'src/dtos/user/auth-register.dto';
import { ApiResponse } from 'src/dtos/api-response';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth-guard.guard';

@ApiTags('Autentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('register')
  @ApiBody({ type: LocalRegister })
  @ApiOperation({ summary: 'Registro de usuario' })
  async userRegistration(@Body() userObject: LocalRegister): Promise<ApiResponse> {
    return await this.authService.userRegistration(userObject);
  }


  @Post("authenticate")
  @ApiOperation({ summary: 'Registro o login de terceros Auth0 (No se recomienda usar desde swagger)' })
  @ApiBody({ type: AuthRegister })
  async loginOrRegister(@Body() userObject: AuthRegister): Promise<LoginResponse> {
    return await this.authService.loginOrRegister(userObject);
  }


  @Post('login')
  @ApiBody({ type: UserLogin })
  @ApiOperation({ summary: 'Login de usuario' })
  async userLogin(@Body() userCredentials: UserLogin): Promise<LoginResponse> {
    return await this.authService.userLogin(userCredentials);
  }


  @Post("admin/register")
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: LocalRegister })
  @ApiOperation({ summary: 'Registro de administrador, debe ser ejecutado por el super admin.' })
  async adminRegistration(@Body() userObject: LocalRegister): Promise<ApiResponse> {
    return await this.authService.adminRegistration(userObject);
  }


  @Get("type/:email")
  @ApiParam({ name: 'email', type: 'string', description: 'Email del usuario' })
  @ApiOperation({ summary: 'Obtener el tipo de autenticacion de usuario' })
  async getAuthType(@Param('email') email: string): Promise<ApiResponse> {
    return await this.authService.getAuthType(email);
  }


  @Put('update-password/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER, UserRole.MAIN_MANAGER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualiza la contraseña de un usuario' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID del usuario' })
  @ApiBody({ type: PickType(LocalRegister, ['password', "confirm_password"]) })
  async updatePassword(@Param('id') id: string, @Body() credentials: Pick<LocalRegister, "password" | "confirm_password">): Promise<ApiResponse> {
    return await this.authService.updatePassword(id, credentials);
  }

}
