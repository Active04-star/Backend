/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isNotEmpty } from "class-validator";
import { AuthRegister } from "src/dtos/user/auth-register.dto";
import { LocalRegister } from "src/dtos/user/local-register.dto";
import { UpdateUser } from "src/dtos/user/update-user.dto";
import { UserList } from "src/dtos/user/users-list.dto";
import { User } from "src/entities/user.entity";
import { UserRole } from "src/enums/roles.enum";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
    
  

    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async deleteUser(userInstance: User): Promise<boolean> {
        const found_user: User | undefined = await this.userRepository.remove(userInstance);
        return found_user === undefined ? false : true;
    }


    async getUserByStripeCustomerId(customerId:string){
        const found_user: User | null = await this.userRepository.findOne({ where: { stripeCustomerId: customerId } });
        return found_user === null ? undefined : found_user;
    }


   async updateStripeCustomerId(user: User, customerId: any) {
    user.stripeCustomerId=customerId
    await this.userRepository.save(user)
return user
    }


    async updateUser(actual_user: User, modified_user: UpdateUser): Promise<User> {
        this.userRepository.merge(actual_user, modified_user);
        await this.userRepository.save(actual_user);

        return actual_user;
    }


    async rankUpTo(user: User, role: UserRole): Promise<User> {
        user.role = role;
        await this.userRepository.save(user);
        return await this.getUserById(user.id);
    }

// en el modulo admin
//    async getUsers(page: number, limit: number): Promise<UserList> {
//        const [users, total] = await this.userRepository.findAndCount({ skip: (page - 1) * limit, take: limit });
//        return {
//            items: total,
//            page: Number(page),
//            limit: Number(limit),
//            total_pages: Math.ceil(total / limit),
//            users: users.map(({ password, ...userWithoutPassword }) => userWithoutPassword),
//          };
//    }

    async getUserById(id: string): Promise<User | undefined> {
        const found_user: User | null = await this.userRepository.findOne({ where: { id: id } });
        return found_user === null ? undefined : found_user;
    }
 // en el modulo de admin
  //  async banOrUnbanUser(userToModify: User): Promise<[User, "deleted" | "restored"]> {
   //     userToModify.was_banned = !userToModify.was_banned;
   //     const user: User = await this.userRepository.save(userToModify);
   //     return [user, user.was_banned ? "deleted" : "restored"];
   // }

    async createUser(userObject: Omit<LocalRegister, "confirm_password"> | AuthRegister): Promise<User> {
        let created_user: User;

        if (this.isLocalRegister(userObject)) {
            if (isNotEmpty(userObject.password)) {
                created_user = this.userRepository.create(userObject);
            }

        } else if (this.isAuthRegister(userObject)) {
            if (isNotEmpty(userObject.sub)) {
                const { sub, ...rest } = userObject;
                created_user = this.userRepository.create({ authtoken: sub, ...rest });
            }
            
        }

        return await this.userRepository.save(created_user);
    }

    async getUserByMail(email: string): Promise<User | undefined> {
        const found: User | null = await this.userRepository.findOne({ where: { email: email } });
        return found ? found : undefined;
    }

    private isLocalRegister(userObject: any): userObject is Omit<LocalRegister, "confirm_password"> {
        return "password" in userObject;
    }

    private isAuthRegister(userObject: any): userObject is AuthRegister {
        return "sub" in userObject;
    }
}