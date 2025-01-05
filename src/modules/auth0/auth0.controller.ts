import { Controller, Get, Param } from "@nestjs/common";
import { Auth0Service } from "./auth0.service";

@Controller("auth0")
export class Auth0Controller {

    constructor(private readonly auth0Service: Auth0Service) { }
    /**PARA TESTING */
    @Get(":id")
    async getUsers(@Param("id") id: string): Promise<any> {
        return await this.auth0Service.getUserByMail(id);
    }
  
}