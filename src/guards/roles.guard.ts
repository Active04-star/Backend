// import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { Observable } from "rxjs";
// import { UserRole } from "src/enums/roles.enum";
//HACE LO MISMO QUE AUTHGUARD
// @Injectable()
// export class RolesGuard implements CanActivate {
    // constructor(private readonly reflector: Reflector) {}

    // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    //     const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
    //         context.getHandler(),
    //         context.getClass(),
    //     ]);

    //     if (!requiredRoles || requiredRoles.length === 0) {
    //         // Si no se especifican roles requeridos, permitimos el acceso
    //         return true;
    //     }

    //     const request = context.switchToHttp().getRequest();
    //     const user = request.user;


    //     console.log('user',user);
        
    //     // Verificar que el usuario tenga roles definidos y que los roles requeridos no sean undefined
    //     if (!user || !user.role || user.role.length === 0) {
    //         throw new ForbiddenException("Usuario no tiene roles asignados.");
    //     }

    //     // Verificar si el usuario tiene alguno de los roles requeridos
    //     const hasRole = requiredRoles.some(role => user.role.includes(role));

    //     if (!hasRole) {
    //         throw new ForbiddenException("No tienes permisos suficientes para acceder a esta ruta.");
    //     }

    //     return true;
    // }
// }
