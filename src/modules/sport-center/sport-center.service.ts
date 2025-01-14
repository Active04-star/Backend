import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SportCenterRepository } from './sport-center.repository';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { User } from 'src/entities/user.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
import { UserService } from '../user/user.service';
import { ApiError } from 'src/helpers/api-error-class';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { isUUID } from 'class-validator';
import { ApiResponse } from 'src/dtos/api-response';
import { SportCenterList } from 'src/dtos/sportcenter/sport-center-list.dto';
import { Sport_Center_Status } from 'src/enums/sport_Center_Status.enum';
import { UserRole } from 'src/enums/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SportCenterService {

  constructor(
    private readonly sportcenterRepository: SportCenterRepository,
    private readonly userService: UserService,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(SportCenter) private sportCenterRepository: Repository<SportCenter>
  ) { }


  async getTotalCenters(show_hidden: boolean): Promise<{ total: number }> {
    const total: number | undefined = await this.sportcenterRepository.getTotalCenters(show_hidden);
    if(total === undefined) {
      throw new ApiError(ApiStatusEnum.CENTER_LIST_EMTPY, NotFoundException);
    }

    return { total: total };
  }


  async updateAverageRating(sportCenter: SportCenter): Promise<void> {
    // Recuperar todas las reseñas activas asociadas a las canchas del centro
    const reviews: Review[] = await this.reviewRepository.find({
      where: {
        sportcenter: { id: sportCenter.id },
      },
    });

    // Calcular el promedio de ratings
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
      reviews.length
      : 0;

    // Actualizar el promedio en el SportCenter
    sportCenter.averageRating = averageRating;
    await this.sportCenterRepository.save(sportCenter);
  }


  async getSportCenters(
    page: number,
    limit: number,
    show_hidden: boolean,
    rating?: number,
    keyword?: string,
  ): Promise<SportCenterList> {

    if (rating < 0 || rating > 5) {
      throw new ApiError(ApiStatusEnum.RATING_OUT_OF_BOUNDS, BadRequestException);

    }

    const found_centers: SportCenterList = await this.sportcenterRepository.getSportCenters(
      page,
      limit,
      show_hidden,
      rating,
      keyword,
    );

    console.log('centers', found_centers);

    if (
      found_centers.sport_centers === undefined ||
      found_centers.sport_centers.length === 0
    ) {
      throw new ApiError(ApiStatusEnum.CENTER_LIST_EMTPY, NotFoundException);
    }

    return found_centers;
  }


  async createSportCenter(createSportCenter: CreateSportCenterDto): Promise<SportCenter> {
    const { manager, ...sportCenterData } = createSportCenter;
    let id = '';

    try {
      const future_manager: User = await this.userService.getUserById(manager);

      if ((await this.getManagerCenters(future_manager)).length > 0) {
        throw new ApiError(ApiStatusEnum.USER_ALREADY_HAS_A_CENTER, BadRequestException);

      }

      await this.userService.hasActiveReservations(future_manager.id);

      const created_sportcenter: SportCenter | undefined =
        await this.sportcenterRepository.createSportCenter(future_manager, sportCenterData);

      if (created_sportcenter === undefined) {
        throw new ApiError(ApiStatusEnum.CENTER_CREATION_FAILED, BadRequestException);

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
        error + ' / ' + deletion_error !== undefined
          ? 'deletion error: ' + deletion_error
          : 'no deletion errors found',
      );
    }
  }


  /**
   * @param id Id del centro deportivo
   * @param relations Declara esto como true si deseas traer las relaciones de la entidad*/
  async getById(id: string, relations = false): Promise<SportCenter> {
    const found_sportcenter: SportCenter | undefined = await this.sportcenterRepository.findOne(id, relations);

    if (found_sportcenter === undefined) {
      throw new ApiError(ApiStatusEnum.CENTER_NOT_FOUND, NotFoundException);
    }

    return found_sportcenter;
  }


  async updateSportCenter(id: string, updateData: UpdateSportCenterDto): Promise<SportCenter> {

    console.log('id', id);

    const sportCenter: SportCenter = await this.getById(id);

    const updated: SportCenter = await this.sportcenterRepository.updateSportCenter(sportCenter, updateData);

    return updated;

  }


  private async deleteSportCenter(id: string): Promise<ApiResponse> {
    try {
      const sport_center: SportCenter = await this.getById(id);

      const was_deleted: boolean =
        await this.sportcenterRepository.deleteSportCenter(sport_center);

      if (!was_deleted) {
        throw new ApiError(ApiStatusEnum.CENTER_DELETION_FAILED, InternalServerErrorException);
      }

      return { message: ApiStatusEnum.CENTER_DELETION_SUCCESS };

    } catch (error) {
      throw new ApiError(error?.message, InternalServerErrorException, error);

    }
  }


  async updateStatus(userId: string, sportCenterId: string, status: Sport_Center_Status): Promise<SportCenter> {
    const user: User = await this.userService.getUserById(userId);

    const found_sportcenter = await this.getById(sportCenterId);

    if (found_sportcenter.main_manager.id !== user.id) {
      throw new ApiError(ApiStatusEnum.CENTER_WRONG_OWNER, BadRequestException);
    }

    if (found_sportcenter.status === status) {
      throw new ApiError(ApiStatusEnum.CENTER_ALREADY_HAS_STATE, BadRequestException, status);
    }

    return await this.sportcenterRepository.updateStatus(found_sportcenter, status);

  }


  async banOrUnban(sportCenterId: string, status: Sport_Center_Status): Promise<SportCenter> {
    const found_sportcenter = await this.getById(sportCenterId);

    if (found_sportcenter.status === status) {
      throw new ApiError(ApiStatusEnum.CENTER_ALREADY_HAS_STATE, BadRequestException, status);
    }

    return await this.sportcenterRepository.updateStatus(found_sportcenter, status);

  }


  private async getManagerCenters(user: User): Promise<SportCenter[]> {
    return await this.sportcenterRepository.getManagerCenters(user);

  }

}
