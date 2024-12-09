import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async getUserByMail(email: string): Promise<User> {
        console.log(email);
        return new User();
        // return await this.userRepository.findOne({ where: { email: email } });
    }
}