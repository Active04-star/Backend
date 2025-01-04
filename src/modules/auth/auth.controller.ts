import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { UserLogin } from 'src/dtos/user/user-login.dto';
import { LoginResponse } from 'src/dtos/user/login-response.dto';
import { AuthRegister } from 'src/dtos/user/auth-register.dto';
import { ApiResponse } from 'src/dtos/api-response';

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


  @Get("type/:email")
  @ApiParam({ name: 'email', type: 'string', description: 'Email del usuario' })
  @ApiOperation({ summary: 'Obtener el tipo de autenticacion de usuario' })
  async getAuthType(@Param('email') email: string): Promise<ApiResponse> {
    return await this.authService.getAuthType(email);
  }

}
