import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { UserService } from '../user/user.service';
import { UserLogin } from 'src/dtos/user/user-login.dto';
import { User } from 'src/entities/user.entity';
import { isNotEmpty } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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


  async updatePassword(id: string, credentials: Pick<LocalRegister, "password" | "confirm_password">): Promise<ApiResponse> {
    const { password, confirm_password } = credentials;

    if (password !== confirm_password) {
      throw new ApiError(ApiStatusEnum.PASSWORDS_DONT_MATCH, BadRequestException);
    }

    const user: User | undefined = await this.userService.getUserById(id);

    const is_same_password = await bcrypt.compare(password, user.password);


    if (isNotEmpty(user)) {

      if (is_same_password) {
        throw new ApiError(ApiStatusEnum.PASSWORD_SAME_AS_OLD, BadRequestException);

      }

      const hashed_password = await bcrypt.hash(password, 10);

      if (!hashed_password) {
        throw new ApiError(ApiStatusEnum.HASHING_FAILED, BadRequestException);
      }

      if (isNotEmpty(user.authtoken)) {
        await this.auth0Service.updateUserPassword(user, password);
      }

      await this.userService.updateUser(user.id, { password: hashed_password });

      return { message: ApiStatusEnum.PASSWORD_UPDATE_SUCCESS };

    }

    throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, BadRequestException);

  }


  async getAuthType(email: string): Promise<ApiResponse> {
    const lower_mail = email.toLowerCase();
    const user: User | undefined = await this.userService.getUserByMail(lower_mail);

    if (isNotEmpty(user) && user.was_banned) {
      throw new ApiError(ApiStatusEnum.USER_DELETED, ForbiddenException);
    }

    if (isNotEmpty(user) && user.password !== null) {
      return { message: ApiStatusEnum.USER_IS_LOCAL };

    }
 
    if (isNotEmpty(user) && user.authtoken !== null && user.password === null) {
      return { message: ApiStatusEnum.USER_IS_THIRD_PARTY };

    }
 
    throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, BadRequestException);
  }


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

      await this.sendWelcomeMail({ name: rest_user.name, email: lower_mail });

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

      let created: UserClean;

      if (found_user === undefined) {
        console.log("Usuario no encontrado. Creando un nuevo registro de usuario");

        created = await this.userService.createUser(userObject);
        this.sendWelcomeMail({ name: rest.name, email: lower_mail });
        return this.signToken(created);

      } else {

        if (sub === found_user.authtoken) {
          return this.signToken(found_user);

        } else if (found_user.authtoken === null) {
          await this.userService.putAuthToken(found_user, sub);
          return this.signToken(found_user);

        } else {
          throw new ApiError(ApiStatusEnum.UNKNOWN_ERROR, BadRequestException);

        }

      }

    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error);

    }

  }


  private async sendWelcomeMail(user: { name: string, email: string }): Promise<void> {
    await this.mailService.sendMail({
      from: 'ActiveProject <activeproject04@gmail.com>',
      to: user.email,
      subject: 'Welcome to our app',
      template: 'registration',
      context: {
        name: user.name,
        contactEmail: 'activeproject04@gmail.com',
      }

    });
  }


  private signToken(user: UserClean): LoginResponse {
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
        stripeCustomerId: user.stripeCustomerId,
      },
    };
  }


  async userLogin(userCredentials: UserLogin): Promise<LoginResponse> {
    const { email, password } = userCredentials;
    const lower_mail = email.toLowerCase();

    const user: User | undefined = await this.userService.getUserByMail(lower_mail);

    if (isNotEmpty(user) && user.was_banned) {
      throw new ApiError(ApiStatusEnum.USER_DELETED, ForbiddenException);
    }

    if (isNotEmpty(user)) {

      if (user.password === null && user.authtoken !== null) {
        throw new ApiError(ApiStatusEnum.USER_IS_THIRD_PARTY, BadRequestException);

      }

      const is_valid_password = await bcrypt.compare(password, user.password);

      if (is_valid_password) {
        return this.signToken(user);
      }
    }

    throw new ApiError(ApiStatusEnum.INVALID_CREDENTIALS, UnauthorizedException);
  }

}
