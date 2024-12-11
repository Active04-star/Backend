/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LocalRegister } from "src/dtos/user/local-register.dto";
import { UpdateUser } from "src/dtos/user/update-user.dto";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async updateUser(actual_user: User, modified_user: UpdateUser): Promise<User> {
        this.userRepository.merge(actual_user, modified_user);
        await this.userRepository.save(actual_user);

        return actual_user;
    }

    async getUsers(page: number, limit: number): Promise<Omit<User, 'password'>[]> {
        const [users, total] = await this.userRepository.findAndCount({ skip: (page - 1) * limit, take: limit });

        return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
    }

    async getUserById(id: string): Promise<User | undefined> {
        const found_user: User | null = await this.userRepository.findOne({ where: { id: id } });
        return found_user === null ? undefined : found_user;
    }

    async banOrUnbanUser(userToModify: User): Promise<[User, "deleted" | "restored"]> {
        userToModify.was_banned = !userToModify.was_banned;
        const user: User = await this.userRepository.save(userToModify);
        return [user, user.was_banned ? "deleted" : "restored"];
    }

    async createUser(userObject: Omit<LocalRegister, "confirm_password">): Promise<User> {
        const created_user: User = this.userRepository.create(userObject);
        return await this.userRepository.save(created_user);
    }

    async getUserByMail(email: string): Promise<User | undefined> {
        const found: User | null = await this.userRepository.findOne({ where: { email: email } });
        return found ? found : undefined;
    }
}