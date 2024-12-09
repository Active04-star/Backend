import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "src/entities/user.entity";

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository) { }

    async getUserByMail(email: string): Promise<User> {
        return await this.userRepository.getUserByMail(email);
    }
}