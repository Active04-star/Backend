import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { UserService } from '../user/user.service';
import { UserLogin } from 'src/dtos/user/user-login.dto';
import { User } from 'src/entities/user.entity';
import { isNotEmpty } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserClean } from 'src/dtos/user/user-clean.dto';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { LoginResponse } from 'src/dtos/user/login-response.dto';
import { ApiError } from 'src/helpers/api-error-class';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthRegister } from 'src/dtos/user/auth-register.dto';
import { ApiResponse } from 'src/dtos/api-response';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly mailService: MailerService) { }

  
  async userRegistration(userObject: LocalRegister): Promise<ApiResponse> {
    try {

      const { email, password, confirm_password, ...rest_user } = userObject;

      if (password !== confirm_password) {
        throw new ApiError(ApiStatusEnum.PASSWORDS_DONT_MATCH, BadRequestException);
      }

      const is_existent: User | undefined = await this.userService.getUserByMail(email);

      if (isNotEmpty(is_existent)) {
        throw new ApiError(ApiStatusEnum.MAIL_IN_USE, ConflictException);
      }

      const hashed_password = await bcrypt.hash(password, 10);

      if (!hashed_password) {
        throw new ApiError(ApiStatusEnum.HASHING_FAILED, BadRequestException);
      }

      await this.userService.createUser({
        ...rest_user,
        email,
        password: hashed_password,
      });

      await this.mailService.sendMail({
        from: 'ActiveProject <activeproject04@gmail.com>',
        to: email,
        subject: 'Welcome to our app',
        template: 'registration',
        context: {
          name: rest_user.name,
          contactEmail: 'activeproject04@gmail.com',
        }

      })

      return { message: ApiStatusEnum.REGISTRATION_SUCCESS };

    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error)
    }

  }


  async authZeroRegistration(userObject: AuthRegister): Promise<UserClean> {
    return new UserClean;
  }

  
  async userLogin(userCredentials: UserLogin): Promise<LoginResponse> {
    const { email, password } = userCredentials;

    const user: User | undefined = await this.userService.getUserByMail(email);

    if (isNotEmpty(user) && user.was_banned) {
      throw new ApiError(ApiStatusEnum.USER_DELETED, UnauthorizedException);
    }

    if (isNotEmpty(user)) {
      const is_valid_password = await bcrypt.compare(password, user.password);

      if (is_valid_password) {
        const token = this.jwtService.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        return {
          message: ApiStatusEnum.LOGIN_SUCCESS,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            profile_image: user.profile_image,
            role: user.role,
            was_banned: user.was_banned,
            subscription_status: user.subscription_status,
            subscription:null     ,
            stripeCustomerId:user.stripeCustomerId                                    //se va a poner la relacio  cuando cree el servicio de subscripcion
          },
        };
      }

    }

    throw new ApiError(ApiStatusEnum.INVALID_CREDENTIALS, UnauthorizedException);
  }
}
