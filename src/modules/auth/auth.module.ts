import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { Auth0Module } from "../auth0/auth0.module";

@Module({
    imports: [MailerModule, UserModule, Auth0Module],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule { }