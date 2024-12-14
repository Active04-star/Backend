import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserClean } from 'src/dtos/user/user-clean.dto';
import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { UserLogin } from 'src/dtos/user/user-login.dto';
import { LoginResponse } from 'src/dtos/user/login-response.dto';
import { AuthRegister } from 'src/dtos/user/auth-register.dto';

@ApiTags('Autentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiBody({
    schema: {
      example: {
        name: 'Tom howard',
        email: 'TomHoward@mail.com',
        password: 'Password!1',
        confirm_password: 'Password!1',
      },
    },
  })
  @ApiOperation({ summary: 'Registro de usuario' })
  async userRegistration(@Body() userObject: LocalRegister): Promise<UserClean> {
    const created_user: UserClean = await this.authService.userRegistration(userObject);
    return created_user;
  }

  @Post("auth-register")
  @ApiOperation({ summary: 'Registro de terceros Auth0' })
  async authZeroRegistration(@Body() userObject: AuthRegister): Promise<UserClean> {
    const created_user: UserClean = await this.authService.authZeroRegistration(userObject);
    return created_user;
  }

  @Post('login')
  @ApiBody({
    schema: {
      example: {
        email: 'TomHoward@mail.com',
        password: 'Password!1',
      },
    },
  })
  @ApiOperation({ summary: 'Login de usuario' })
  async userLogin(@Body() userCredentials: UserLogin): Promise<LoginResponse> {
    return await this.authService.userLogin(userCredentials);
  }
}
