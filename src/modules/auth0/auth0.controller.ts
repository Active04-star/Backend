import { Controller, Get, Param } from "@nestjs/common";
import { Auth0Service } from "./auth0.service";
import { ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("tp-auth")
@Controller()
export class Auth0Controller {

    constructor(private readonly auth0Service: Auth0Service) { }

    @Get(":id")
    @ApiParam({ name: "id", type: String })
    async getUsers(@Param("id") id: string): Promise<any> {
        return await this.auth0Service.getUserByMail(id);
    }
}