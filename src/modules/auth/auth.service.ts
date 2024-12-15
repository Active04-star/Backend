import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { UserService } from '../user/user.service';
import { UserLogin } from 'src/dtos/user/user-login.dto';
import { User } from 'src/entities/user.entity';
import { isNotEmpty } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserClean } from 'src/dtos/user/user-clean.dto';
import { StatusEnum } from 'src/enums/HttpStatus.enum';
import { LoginResponse } from 'src/dtos/user/login-response.dto';
import { ApiError } from 'src/helpers/api-error-class';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthRegister } from 'src/dtos/user/auth-register.dto';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly mailService: MailerService) { }

  async userRegistration(userObject: LocalRegister): Promise<UserClean> {
    const { email, password, confirm_password, ...rest_user } = userObject;

    if (password !== confirm_password) {
      throw new ApiError(StatusEnum.PASSWORDS_DONT_MATCH, BadRequestException);
    }

    const is_existent: User | undefined = await this.userService.getUserByMail(email);

    if (isNotEmpty(is_existent)) {
      throw new ApiError(StatusEnum.MAIL_IN_USE, ConflictException);
    }

    const hashed_password = await bcrypt.hash(password, 10);

    if (!hashed_password) {
      throw new ApiError(StatusEnum.HASHING_FAILED, BadRequestException);
    }

    const user: UserClean = await this.userService.createUser({
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
        name:rest_user.name, 
        contactEmail: 'activeproject04@gmail.com', 
      }
      
    })

    return user;
  }

  async authZeroRegistration(userObject: AuthRegister): Promise<UserClean> {
    return new UserClean
  }

  async userLogin(userCredentials: UserLogin): Promise<LoginResponse> {
    const { email, password } = userCredentials;

    const user: User | undefined = await this.userService.getUserByMail(email);

    if (isNotEmpty(user) && user.was_banned) {
      throw new ApiError(StatusEnum.USER_DELETED, UnauthorizedException);
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
          message: StatusEnum.LOGIN_SUCCESS,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            profile_image: user.profile_image,
            role: user.role,
            was_banned: user.was_banned,
            subscription_status: user.subscription_status
          },
        };
      }

    }

    throw new ApiError(StatusEnum.INVALID_CREDENTIALS, UnauthorizedException);
  }
}
