import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SportCenterRepository } from './sport-center.repository';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { User } from 'src/entities/user.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
import { Sport_Category } from 'src/entities/sport_category.entity';
import { Sport_Category_Service } from '../sport-category/sport-category.service';
import { UserService } from '../user/user.service';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { isUUID } from 'class-validator';
import { ApiResponse } from 'src/dtos/api-response';
import { SportCenterList } from 'src/dtos/sportcenter/sport-center-list.dto';
import { Sport_Center_Status } from 'src/enums/sport_Center_Status.enum';
import { UserRole } from 'src/enums/roles.enum';

@Injectable()
export class SportCenterService {
  constructor(
    private readonly sportcenterRepository: SportCenterRepository,
    private readonly userService: UserService,
    @Inject(forwardRef(() => Sport_Category_Service))
    private sportCategoryService: Sport_Category_Service,
  ) {}

  async getSportCenters(
    page: number,
    limit: number,
    show_hidden: boolean,
    rating?: number,
    keyword?: string,
  ): Promise<SportCenterList> {
    if (rating < 1 || rating > 5) {
      throw new ApiError(
        ApiStatusEnum.RATING_OUT_OF_BOUNDS,
        BadRequestException,
      );
    }

    const found_centers: SportCenterList =
      await this.sportcenterRepository.getSportCenters(
        page,
        limit,
        show_hidden,
        rating,
        keyword,
      );

    if (
      found_centers.sport_centers === undefined ||
      found_centers.sport_centers.length === 0
    ) {
      throw new ApiError(ApiStatusEnum.CENTER_LIST_EMTPY, NotFoundException);
    }

    return found_centers;
  }

  async createSportCenter(
    createSportCenter: CreateSportCenterDto,
  ): Promise<SportCenter> {
    const { manager, ...sportCenterData } = createSportCenter;
    // let images_urls: string[];
    // let images_inserted: Image[];
    let id = '';

    try {
      const future_manager: User = await this.userService.getUserById(manager);

      await this.userService.hasActiveReservations(future_manager.id);

      const created_sportcenter: SportCenter | undefined =
        await this.sportcenterRepository.createSportCenter(
          future_manager,
          sportCenterData,
        );

      if (created_sportcenter === undefined) {
        throw new ApiError(
          ApiStatusEnum.CENTER_CREATION_FAILED,
          BadRequestException,
        );
      }

      await this.userService.rankUpTo(future_manager, UserRole.MAIN_MANAGER);

      id = created_sportcenter.id;

      return await this.getById(id);
    } catch (error) {
      let deletion_error: any;

      if (isUUID(id)) {
        try {
          await this.deleteSportCenter(id);
        } catch (error) {
          deletion_error = error?.message;
        }
      }

      throw new ApiError(
        error?.message,
        InternalServerErrorException,
        error + ' / ' + deletion_error !== undefined ? deletion_error : null,
      );
    }
  }

  /**
   *
   * @param id Id del centro deportivo
   * @param relations Declara esto como true si deseas traer las relaciones de la entidad
   */
  async getById(id: string, relations = false): Promise<SportCenter> {
    const found_sportcenter: SportCenter | undefined =
      await this.sportcenterRepository.findOne(id, relations);

    if (found_sportcenter === undefined) {
      throw new ApiError(ApiStatusEnum.CENTER_NOT_FOUND, NotFoundException);
    }

    return found_sportcenter;
  }

  async updateSportCenter(
    id: string,
    updateData: UpdateSportCenterDto,
  ): Promise<SportCenter> {
    const sportCenter: SportCenter = await this.getById(id);

    const updated: SportCenter =
      await this.sportcenterRepository.updateSportCenter(
        sportCenter,
        updateData,
      );
    return updated;
  }

  private async deleteSportCenter(id: string): Promise<ApiResponse> {
    try {
      const sport_center: SportCenter = await this.getById(id);

      const was_deleted: boolean =
        await this.sportcenterRepository.deleteSportCenter(sport_center);

      if (!was_deleted) {
        throw new ApiError(
          ApiStatusEnum.CENTER_DELETION_FAILED,
          InternalServerErrorException,
        );
      }

      return { message: ApiStatusEnum.CENTER_DELETION_SUCCESS };
    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error);
    }
  }

  // async publishSportCenter(userId: string, sportCenterId: string): Promise<SportCenter> {
  //   //publicas un sportcenter que esta en draft, si el usuario con rol de user publica el sportcenter se convierte en manager

  //   const user: User = await this.userService.getUserById(userId);

  //   const found_sportcenter = await this.getById(sportCenterId);

  //   if (found_sportcenter.status === SportCenterStatus.PUBLISHED) {
  //     throw new ApiError(ApiStatusEnum.CENTER_ALREADY_HAS_STATE, BadRequestException, SportCenterStatus.PUBLISHED);
  //   }

  //   if (found_sportcenter.main_manager.id !== user.id) {
  //     throw new ApiError(ApiStatusEnum.CENTER_WRONG_OWNER, BadRequestException);
  //   }

  //   return await this.sportcenterRepository.updateStatus(found_sportcenter, SportCenterStatus.PUBLISHED);

  //   // if (found_sportcenter.sport_categories.length === 0 || found_sportcenter.fields.length === 0) {
  //   //   throw new ApiError();
  //   // }

  //   // if (user.role !== 'manager') {
  //   //   await this.rankUp(user, UserRole.MANAGER);
  //   // }

  // }

  // async disableSportCenter(userId: string, sportCenterId: string): Promise<SportCenter> {
  //   //se desabilita un sportcenter , el usuario sigue siendo manager . el sportcenter no se va a ver por otros usuarios

  //   // Buscar el usuario
  //   // const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['managed_centers'] });
  //   const user: User = await this.userService.getUserById(userId);

  //   const found_sportcenter = await this.getById(sportCenterId);

  //   if (found_sportcenter.status === SportCenterStatus.DISABLE) {
  //     throw new ApiError(ApiStatusEnum.CENTER_ALREADY_HAS_STATE, BadRequestException, SportCenterStatus.DISABLE);
  //   }

  //   if (found_sportcenter.main_manager.id !== user.id) {
  //     throw new ApiError(ApiStatusEnum.CENTER_WRONG_OWNER, BadRequestException);
  //   }

  //   return await this.sportcenterRepository.updateStatus(found_sportcenter, SportCenterStatus.DISABLE);
  // }

  async updateStatus(
    userId: string,
    sportCenterId: string,
    status: Sport_Center_Status,
  ): Promise<SportCenter> {
    const user: User = await this.userService.getUserById(userId);

    const found_sportcenter = await this.getById(sportCenterId);

    if (found_sportcenter.status === status) {
      throw new ApiError(
        ApiStatusEnum.CENTER_ALREADY_HAS_STATE,
        BadRequestException,
        status,
      );
    }

    if (found_sportcenter.main_manager.id !== user.id) {
      throw new ApiError(ApiStatusEnum.CENTER_WRONG_OWNER, BadRequestException);
    }

    return await this.sportcenterRepository.updateStatus(
      found_sportcenter,
      status,
    );
  }

  async putCategoryToCenter(category: string[], sportCenterId: string) {
    const sport_center: SportCenter = await this.getById(sportCenterId);
    const sport_categories: Sport_Category[] =
      await this.sportCategoryService.searchCategories(category);
    const updated_sportcenter: SportCenter | undefined =
      await this.sportcenterRepository.putCategoryToCenter(
        sport_categories,
        sport_center,
      );

    if (updated_sportcenter === undefined) {
      //ERROR
    }
    return updated_sportcenter;
  }

  async banOrUnBanCenter(id: string): Promise<ApiResponse> {
    const found_center: SportCenter = await this.getById(id);
    return new ApiResponse();
  }
}
