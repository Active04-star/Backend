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
import { AuthRegister } from "src/dtos/user/auth-register.dto";

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository) { }


    async deleteUser(id: string): Promise<boolean> {
        const found_user: User = await this.userRepository.getUserById(id);
        return await this.userRepository.deleteUser(found_user);
    }

    async getUserByStripeCustomerId(customerId: string) {
        const found_user: User | undefined =
            await this.userRepository.getUserByStripeCustomerId(customerId);

        if (isEmpty(found_user)) {
            throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
        }
        return found_user;
    }



    async updateStripeCustomerId(user: User, customerId: any) {
        const updatedUser: User = await this.userRepository.updateStripeCustomerId(
            user,
            customerId,
        );
        const { password, ...filtered_user } = updatedUser;

        return filtered_user;
    }

    async updateUser(id: string, modified_user: UpdateUser): Promise<UserClean> {
        const found_user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
        }

        return new UserClean();
    }

    async rankUpTo(user: User, rank: UserRole): Promise<boolean> {
        const ranked_up: User | undefined = await this.userRepository.rankUpTo(user, rank);

        if (ranked_up === undefined) {
            return false;
        }
        return true;
    }

    async getUserById(id: string): Promise<User> {
        const found_user: User | undefined =
            await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
        }
        return found_user;
    }

    async getUserByMail(email: string): Promise<User | undefined> {
        const found: User | undefined = await this.userRepository.getUserByMail(email);
        //ESTA FUNCION NUNCA DEBE LANZAR ERROR
        return found;
    }

    async createUser(userObject: Omit<LocalRegister, "confirm_password"> | AuthRegister): Promise<UserClean> {
        try {
            const created_user: User = await this.userRepository.createUser(userObject);
            const { password, authtoken, ...filtered } = created_user;

            return filtered;
        } catch (error) {
            throw new ApiError(error?.message, BadRequestException, error);

        }
    }
}

