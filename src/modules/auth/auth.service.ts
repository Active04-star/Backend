import { UserRegister } from "src/dto/user/user-register.dto";
import { UserService } from "../user/user.service";
import { UserLogin } from "src/dto/user/user-login.dto";

export class AuthService {

    constructor(private readonly userService: UserService) { }

    async userRegistration(userObject: UserRegister): Promise<any> {

    }

    async userLogin(userCredentials: UserLogin): Promise<any> {
        return 0
    }
}