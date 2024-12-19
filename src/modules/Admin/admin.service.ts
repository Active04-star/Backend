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
import { SportCenterList } from "src/dtos/sportcenter/sport-center-list.dto";
import { SportCenterStatus } from "src/enums/sportCenterStatus.enum";
import { SportCenter } from "src/entities/sportcenter.entity";
import { AdminRepository } from "./admin.repository";
import { Reservation } from "src/entities/reservation.entity";
import { ReservationStatus } from "src/enums/reservationStatus.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
        private readonly adminRepository: AdminRepository) {}

    async getUsers(page: number, limit: number): Promise<UserList> {
        const found_users: UserList = await this.adminRepository.getUsers(page, limit);

        if (found_users.users.length === 0) {
            throw new ApiError(ApiStatusEnum.USER_LIST_EMPTY, NotFoundException);
        }
        return found_users;
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

    async banOrUnbanCenter(id: string, estado: SportCenterStatus): Promise<ApiResponse> {
            const found_center: SportCenter | undefined = await this.adminRepository.getCenterById(id)

            if (isEmpty(found_center)) {
                throw new ApiError(ApiStatusEnum.CENTER_NOT_FOUND, NotFoundException)
            }

            if(found_center.fields.some(field => field.reservation.some(reserva => reserva.status === 'pending'))){
                return {message: ApiStatusEnum.CENTER_DELETION_FAILED}
            }

            const changeCenter = await this.adminRepository.banOrUnbanCenter(found_center, estado)
            if(changeCenter){
                return {message: ApiStatusEnum.CENTER_UPDATE_STATUS}
            }
    }

    async forceBan(id: string, status: SportCenterStatus): Promise<ApiResponse> {
        const found_center: SportCenter | undefined = await this.adminRepository.getCenterById(id)

        if (isEmpty(found_center)) {
            throw new ApiError(ApiStatusEnum.CENTER_NOT_FOUND, NotFoundException)
        }

        const forceBanPromises: Promise<Reservation>[] = [];

        for (const field of found_center.fields) {
            for (const reserva of field.reservation) {
                if (reserva.status === 'pending') {
                    reserva.status = ReservationStatus.CANCELLED;
                    forceBanPromises.push(this.reservationRepository.save(reserva));
                }
            }
        }
    
        await Promise.all(forceBanPromises);
        
        const changeCenter = await this.adminRepository.banOrUnbanCenter(found_center, status)
        if(changeCenter){
            return {message: ApiStatusEnum.CENTER_UPDATE_STATUS}
        }

    }
}