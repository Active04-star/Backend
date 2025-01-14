import { Injectable, InternalServerErrorException, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/entities/user.entity';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ApiError } from 'src/helpers/api-error-class';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class IllegalUserMiddleware implements NestMiddleware {

    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {

        const token: string | undefined = this.extractTokenFromHeader(req);

        if (token === undefined) {
            next();

        } else {

            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_SECRET,
                });

                const user: User = await this.userService.getUserById(payload.id);

                if (user.was_banned) {
                    throw new ApiError(ApiStatusEnum.USER_DELETED, UnauthorizedException);

                }

                next();
            } catch (error) {
                if (error.message === "jwt expired") {
                    next();

                } else {
                    throw new ApiError(error?.message, (error as ApiError).exception || InternalServerErrorException, error);

                }
            }
        }
    }


    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers['authorization'];

        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }
        return undefined;
    }

}