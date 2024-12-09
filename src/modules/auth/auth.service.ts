import { LocalRegister } from "src/dto/user/local-register.dto";
import { UserService } from "../user/user.service";
import { UserLogin } from "src/dto/user/user-login.dto";

export class AuthService {

    constructor(private readonly userService: UserService) { }

    async userRegistration(userObject: LocalRegister): Promise<any> {

    }

    async userLogin(userCredentials: UserLogin): Promise<any> {
        return 0
    }
}