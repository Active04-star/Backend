import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [MailerModule, UserModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule { }