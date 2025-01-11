import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { UserRole } from "src/enums/roles.enum";
import { ApiError } from "src/helpers/api-error-class";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) throw new ApiError(ApiStatusEnum.NO_TOKEN_PROVIDED, UnauthorizedException);

        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            request.user = payload;

        } catch (error) {
            throw new ApiError(ApiStatusEnum.INVALID_TOKEN, UnauthorizedException);
        }

        const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());

        if (requiredRoles && requiredRoles.length > 0) {
            const hasRole = () => requiredRoles.some((role) => role === payload.role);

            if (!hasRole()) {
                throw new ApiError(ApiStatusEnum.INSUFFICIENT_PERMISSIONS, UnauthorizedException);

            }
        }

        return true;
    }


    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers['authorization'];

        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }
        return undefined;
    }
}
