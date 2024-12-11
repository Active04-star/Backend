/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "src/entities/user.entity";
import { UserClean } from "../../dtos/user/user-clean.dto";
import { LocalRegister } from "src/dtos/user/local-register.dto";
import { StatusEnum } from "src/enums/HttpStatus.enum";
import { isEmpty } from "class-validator";
import { UpdateUser } from "src/dtos/user/update-user.dto";
import { ApiError } from "src/helpers/api-error-class";

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository) { }

    async updateUser(id: string, modified_user: UpdateUser): Promise<UserClean> {
        const found_user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw new ApiError(StatusEnum.USER_NOT_FOUND, NotFoundException);
        }

        const updated_user: User = await this.userRepository.updateUser(found_user, modified_user);
        const { password, ...filtered_user } = updated_user;

        return filtered_user;
    }

    async banOrUnbanUser(id: string): Promise<{ message: StatusEnum }> {
        const found_user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw new ApiError(StatusEnum.USER_NOT_FOUND, NotFoundException);
        }

        try {
            const [updated_user, status]: [User, string] = await this.userRepository.banOrUnbanUser(found_user);

            if (updated_user && status === "deleted") {
                return { message: StatusEnum.USER_DELETED };

            } else if (updated_user && status === "restored") {
                return { message: StatusEnum.USER_RESTORED };

            }

            throw new ApiError(StatusEnum.USER_UNBAN_OR_BAN, BadRequestException, "Something went wrong trying to modify this");

        } catch (error) {
            throw new ApiError(error?.message, BadRequestException, error);

        }
    }

    async getUsers(page: number, limit: number): Promise<Omit<User, 'password'>[]> {
        const found_users: Omit<User, 'password'>[] = await this.userRepository.getUsers(page, limit);

        if (found_users.length === 0) {
            throw new ApiError(StatusEnum.USER_LIST_EMPTY, NotFoundException);
        }
        return found_users;
    }

    async getUserByMail(email: string): Promise<User | undefined> {
        const found: User | undefined = await this.userRepository.getUserByMail(email);
        return found;
    }

    async createUser(userObject: Omit<LocalRegister, "confirm_password">): Promise<UserClean> {
        const created_user: User = await this.userRepository.createUser(userObject);
        const { password, ...filtered } = created_user;

        return filtered;
    }
}