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
import { Auth0Service } from '../auth0/auth0.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly auth0Service: Auth0Service
  ) { }


  async userRegistration(userObject: LocalRegister): Promise<ApiResponse> {
    let id: string = "";

    try {
      const { email, password, confirm_password, ...rest_user } = userObject;

      const lower_mail = email.toLowerCase();

      if (password !== confirm_password) {
        throw new ApiError(ApiStatusEnum.PASSWORDS_DONT_MATCH, BadRequestException);

      }

      const is_existent: User | undefined =
        await this.userService.getUserByMail(lower_mail);

      if (isNotEmpty(is_existent)) {
        throw new ApiError(ApiStatusEnum.MAIL_IN_USE, ConflictException);
      }

      const hashed_password = await bcrypt.hash(password, 10);

      if (!hashed_password) {
        throw new ApiError(ApiStatusEnum.HASHING_FAILED, BadRequestException);
      }

      const created: UserClean = await this.userService.createUser({
        ...rest_user,
        email: lower_mail,
        password: hashed_password,
      });

      id = created.id;

      await this.auth0Service.syncUser({ name: rest_user.name, email: lower_mail, password, id: created.id });

      await this.mailService.sendMail({
        from: 'ActiveProject <activeproject04@gmail.com>',
        to: lower_mail,
        subject: 'Welcome to our app',
        template: 'registration',
        context: {
          name: rest_user.name,
          contactEmail: 'activeproject04@gmail.com',
        }

      });

      return { message: ApiStatusEnum.REGISTRATION_SUCCESS };

    } catch (error) {
      if (isNotEmpty(id)) {
        await this.userService.deleteUser(id);
      }

      throw new ApiError(error?.message, InternalServerErrorException, error);
    }
  }


  async loginOrRegister(userObject: AuthRegister): Promise<LoginResponse> {
    const { email, sub, ...rest } = userObject;
    const lower_mail = email.toLowerCase();

    try {

      const found_user: User | undefined = await this.userService.getUserByMail(lower_mail);

      console.log(found_user || "Usuario no encontrado. Creando un nuevo registro de usuario");
      let created: UserClean;

      if (found_user === undefined) {
        created = await this.userService.createUser(userObject);

      } else {

        if (sub === found_user.authtoken) {
          const token = this.jwtService.sign({
            id: found_user.id,
            email: found_user.email,
            role: found_user.role,
          });

          return {
            message: ApiStatusEnum.LOGIN_SUCCESS,
            token,
            user: {
              id: found_user.id,
              name: found_user.name,
              email: found_user.email,
              profile_image: found_user.profile_image,
              role: found_user.role,
              was_banned: found_user.was_banned,
              subscription_status: found_user.subscription_status,
              subscription: null,
              stripeCustomerId: found_user.stripeCustomerId,
            },
          };
        } else {
          throw new ApiError(ApiStatusEnum.TEST_ERROR, BadRequestException);
          
        }
      }

      await this.mailService.sendMail({
        from: 'ActiveProject <activeproject04@gmail.com>',
        to: lower_mail,
        subject: 'Welcome to our app',
        template: 'registration',
        context: {
          name: rest.name,
          contactEmail: 'activeproject04@gmail.com',
        }

      });

      if (created !== undefined) {

        const token = this.jwtService.sign({
          id: created.id,
          email: created.email,
          role: created.role,
        });

        return {
          message: ApiStatusEnum.LOGIN_SUCCESS,
          token,
          user: {
            id: created.id,
            name: created.name,
            email: created.email,
            profile_image: created.profile_image,
            role: created.role,
            was_banned: created.was_banned,
            subscription_status: created.subscription_status,
            subscription: null,
            stripeCustomerId: created.stripeCustomerId,
          },
        };

      }

    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error);

    }

  }


  async userLogin(userCredentials: UserLogin): Promise<LoginResponse> {
    const { email, password } = userCredentials;
    const lower_mail = email.toLowerCase();

    const user: User | undefined = await this.userService.getUserByMail(lower_mail);

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
            subscription: null,
            stripeCustomerId: user.stripeCustomerId
          },
        };
      }
    }

    throw new ApiError(ApiStatusEnum.INVALID_CREDENTIALS, UnauthorizedException);
  }

}
