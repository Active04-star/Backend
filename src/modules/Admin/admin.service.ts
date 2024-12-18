import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
import { AdminRepository } from "./admin.repository";
import { SportCenterList } from "src/dtos/sportcenter/sport-center-list.dto";

@Injectable()
export class AdminService {
    constructor(private readonly adminRepository: AdminRepository) {}

    async getUsers(page: number, limit: number): Promise<UserList> {
        const found_users: UserList = await this.adminRepository.getUsers(page, limit);

        if (found_users.users.length === 0) {
            throw new ApiError(ApiStatusEnum.USER_LIST_EMPTY, NotFoundException);
        }
        return found_users;
    }

    async getCenterBan(page: number, limit: number): Promise<SportCenterList> {
            const found_centers: SportCenterList = await this.adminRepository.getCenterBan(page, limit)
            
            if(found_centers.sport_centers.length === 0) {
                throw new ApiError(ApiStatusEnum.CENTER_LIST_BAN, NotFoundException);
            }
            return found_centers
    }


    async banOrUnbanUser(id: string): Promise<ApiResponse> {
        try {

            const found_user: User | undefined = await this.adminRepository.getUserById(id);

            if (isEmpty(found_user)) {
                throw new ApiError(ApiStatusEnum.USER_NOT_FOUND, NotFoundException);
            }

            const [updated_user, status]: [User, string] = await this.adminRepository.banOrUnbanUser(found_user);

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
}