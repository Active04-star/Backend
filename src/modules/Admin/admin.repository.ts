import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SportCenterList } from "src/dtos/sportcenter/sport-center-list.dto";
import { LocalRegister } from "src/dtos/user/local-register.dto";
import { UpdateUser } from "src/dtos/user/update-user.dto";
import { UserList } from "src/dtos/user/users-list.dto";
import { User } from "src/entities/user.entity";
import { UserRole } from "src/enums/roles.enum";
import { Repository } from "typeorm";

@Injectable()
export class AdminRepository {
    constructor( 
        @InjectRepository(User) private adminRepository: Repository<User>) {}
    
        async getUsers(page: number, limit: number): Promise<UserList> {
            const [users, total] = await this.adminRepository.findAndCount({ skip: (page - 1) * limit, take: limit });
            return {
                items: total,
                page: Number(page),
                limit: Number(limit),
                total_pages: Math.ceil(total / limit),
                users: users.map(({ password, ...userWithoutPassword }) => userWithoutPassword),
              };
        }


            async getUserById(id: string): Promise<User | undefined> {
                const found_user: User | null = await this.adminRepository.findOne({ where: { id: id } });
                return found_user === null ? undefined : found_user;
            }

            async banOrUnbanUser(userToModify: User): Promise<[User, "deleted" | "restored"]> {
                userToModify.was_banned = !userToModify.was_banned;
                const user: User = await this.adminRepository.save(userToModify);
                return [user, user.was_banned ? "deleted" : "restored"];
            }


}