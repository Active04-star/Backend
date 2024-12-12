import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SportCenterRepository } from './sport-center.repository';
import { CreateSportCenterDto } from 'src/dtos/sportcenter/createSportCenter.dto';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { SportCenter } from 'src/entities/sportcenter.entity';
import { Photos } from 'src/entities/photos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSportCenterDto } from 'src/dtos/sportcenter/updateSportCenter.dto';
import { UserRole } from 'src/enums/roles.enum';

@Injectable()
export class SportCenterService {
  constructor(
    private readonly sportcenterRepository: SportCenterRepository,
    @InjectRepository(Photos)
    private photoRepository: Repository<Photos>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getSportCenters(
    page: number,
    limit: number,
    rating?: number,
    search?: string,
  ): Promise<SportCenter[]> {
    if (rating < 1 || rating > 5)
      throw new BadRequestException('rating must be between 1 and 5');

    const found_SportCenters: SportCenter[] =
      await this.sportcenterRepository.getSportCenters(
        page,
        limit,
        rating,
        search,
      );

    if (found_SportCenters.length === 0) {
      throw new BadRequestException('no existe ningun centro deportivo');
    }

    return found_SportCenters;
  }

  async createSportCenter(createSportCenter: CreateSportCenterDto) {
    const { manager, photos, ...sportCenterData } = createSportCenter;
    const future_manager: User = await this.userRepository.findOneBy({
      id: manager,
    });
    const created_sportcenter: SportCenter | undefined =
      await this.sportcenterRepository.createSportCenter(
        future_manager,
        sportCenterData,
      );

    if (created_sportcenter === undefined) {
      throw new HttpException(
        'problema de servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (photos && photos.length > 0) {
      const photoEntitites = photos.map((url) => {
        const photo = new Photos();
        photo.url = url;
        photo.sportcenter = created_sportcenter;
        return photo;
      });

      const saved_photos = await this.photoRepository.save(photoEntitites);

      if (!saved_photos)
        throw new HttpException(
          'problema de servidor',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      return await this.sportcenterRepository.findOne(created_sportcenter.id);
    }
  }

  async findOne(id: string): Promise<SportCenter> {
    const found_sportcenter: SportCenter | undefined =
      await this.sportcenterRepository.findOne(id);

    if (found_sportcenter === undefined) {
      throw new HttpException(
        'Restauarnte no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return found_sportcenter;
  }

  async updateSportCenter(id: string, updateData: UpdateSportCenterDto) {
    const sportCenter = await this.sportcenterRepository.findOne(id);
    if (!sportCenter) {
      throw new NotFoundException(`SportCenter with ID ${id} not found`);
    }
    const updatedSportCenter =
      await this.sportcenterRepository.updateSportCenter(
        sportCenter,
        updateData,
      );
    return updatedSportCenter;
  }

  async deleteSportCenter(id: string) {
    const sportCenter = await this.sportcenterRepository.findOne(id);

    if (!sportCenter) {
      throw new NotFoundException(`SportCenter with ID ${id} not found`);
    }

    const { manager } = sportCenter;

    // Si el usuario no tiene el rol de MANAGER, no hacemos nada con el rol
    if (manager.role !== UserRole.MANAGER) {
      return await this.sportcenterRepository.deleteSportCenter(sportCenter);
    }

    await this.sportcenterRepository.deleteSportCenter(sportCenter);

    const remainigSportCenters: SportCenter[] =
      await this.sportcenterRepository.countActiveAndDisable(manager);

    if (remainigSportCenters.length === 0) {
      manager.role = UserRole.USER;
      await this.userRepository.save(manager);
    }
  }

  async rankUp(userInstance: User, role: UserRole): Promise<void> {
    userInstance.role = role;
    await this.userRepository.save(userInstance);
  }

  async publishSportCenter(
    userId: string,
    sportCenterId: string,
  ): Promise<SportCenter> {
    //publcias un sportcenter que esta en draft, si el usuario con rol de consumer publica el sportcenter se convierte en manager

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['managed_centers'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const found_sportcenter = await this.findOne(sportCenterId);

    if (found_sportcenter.status === 'published')
      throw new BadRequestException('El centro deportivo ya esta publicado');

    if (found_sportcenter.manager.id !== user.id) {
      throw new UnauthorizedException(
        `You are not authorized to disable this SportCenter.`,
      );
    }

    if (
      found_sportcenter.sport_category.length === 0 ||
      found_sportcenter.field.length === 0
    )
      throw new BadRequestException('Faltan rellenar campos');

    if (user.role !== 'manager') await this.rankUp(user, UserRole.MANAGER);

    return await this.sportcenterRepository.publishSportCenter(
      found_sportcenter,
    );
  }

  async disableSportCenter(
    userId: string,
    sportCenterId: string,
  ): Promise<SportCenter> {
    //se desabilita un sportcenter , el usuario sigue siendo manager . el sportcenter no se va a ver por otros usuarios

    // Buscar el usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['managed_centers'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const found_sportcenter = await this.findOne(sportCenterId);

    if (found_sportcenter.status === 'disable')
      throw new BadRequestException('El centro deportivo ya fue desabilitado');

    if (found_sportcenter.manager.id !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to disable this SportCenter.`,
      );
    }

    return await this.sportcenterRepository.disableSportCenter(
      found_sportcenter,
    );
  }
}
