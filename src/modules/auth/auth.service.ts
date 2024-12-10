import { LocalRegister } from 'src/dtos/user/local-register.dto';
import { UserService } from '../user/user.service';
import { UserLogin } from 'src/dtos/user/user-login.dto';

export class AuthService {
  constructor(private readonly userService: UserService) {}

  async userRegistration(userObject: LocalRegister): Promise<any> {}

  async userLogin(userCredentials: UserLogin): Promise<any> {
    return 0;
  }
}
