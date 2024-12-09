import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";

@Injectable()
export class UserRepository {
    // constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async getUserByMail(email: string): Promise<User> {
        return new User();
        // return await this.userRepository.findOne({ where: { email: email } });
    }
}