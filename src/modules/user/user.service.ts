/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "src/entities/user.entity";
import { UserClean } from "../../dtos/user/user-clean.dto";
import { LocalRegister } from "src/dtos/user/local-register.dto";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";
import { isEmpty } from "class-validator";
import { UpdateUser } from "src/dtos/user/update-user.dto";
import { ApiError } from "src/helpers/api-error-class";
import { ApiResponse } from "src/dtos/api-response";
import { UserRole } from "src/enums/roles.enum";
import { UserList } from "src/dtos/user/users-list.dto";

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository) { }

    async updateUser(id: string, modified_user: UpdateUser): Promise<UserClean> {
        const found_user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
        }

        const updated_user: User = await this.userRepository.updateUser(found_user, modified_user);
        const { password, ...filtered_user } = updated_user;

        return filtered_user;
    }

    
    async rankUpTo(user: User, rank: UserRole): Promise<boolean> {
        const ranked_up: User | undefined = await this.userRepository.rankUpTo(user, rank);

        if (ranked_up === undefined) {
            return false;
        }
        return true;
    }


    async getUserById(id: string): Promise<User> {
        const found_user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
        }
        return found_user;
    }


    async banOrUnbanUser(id: string): Promise<ApiResponse> {
        try {

            const found_user: User | undefined = await this.userRepository.getUserById(id);

            if (isEmpty(found_user)) {
                throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
            }

            const [updated_user, status]: [User, string] = await this.userRepository.banOrUnbanUser(found_user);

            if (updated_user && status === "deleted") {
                return { message: ApiStatusEnum.USER_DELETED };

            } else if (updated_user && status === "restored") {
                return { message: ApiStatusEnum.USER_RESTORED };

            }

            throw new ApiError(ApiStatusEnum.USER_UNBAN_OR_BAN, BadRequestException, "Something went wrong trying to modify this");

        } catch (error) {
            throw new ApiError(error?.message, BadRequestException, error);
        }
    }


    async getUsers(page: number, limit: number): Promise<UserList> {
        const found_users: UserList = await this.userRepository.getUsers(page, limit);

        if (found_users.users.length === 0) {
            throw new ApiError(ApiStatusEnum.USER_LIST_EMPTY, NotFoundException);
        }
        return found_users;
    }


    async getUserByMail(email: string): Promise<User> {
        const found: User | undefined = await this.userRepository.getUserByMail(email);

        if (found === undefined) {
            throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
        }
        return found;
    }


    async createUser(userObject: Omit<LocalRegister, "confirm_password">): Promise<UserClean> {
        try {
            const created_user: User = await this.userRepository.createUser(userObject);
            const { password, ...filtered } = created_user;

            return filtered;
        } catch (error) {
            throw new ApiError(error?.message, BadRequestException, error);

        }
    }
}