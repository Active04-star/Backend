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
    private readonly userService: UserService,
    @InjectRepository(Photos)
    private photoRepository: Repository<Photos>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getSportCenters(): Promise<SportCenter[]> {
    const found_SportCenters: SportCenter[] =
      await this.sportcenterRepository.getSportCenters();

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

  async deleteSportCenter(id: string, email: string) {
    // Obtener el usuario por email
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['sportCenters'],
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // Verificar si el SportCenter pertenece al usuario
    const sportCenter = await this.findOne(id);

    if (sportCenter.manager.email == user.email) {
      throw new HttpException(
        'El SportCenter no pertenece al usuario o no existe',
        HttpStatus.NOT_FOUND,
      );
    }

    // Eliminar el SportCenter
    await this.sportcenterRepository.deleteSportCenter(sportCenter);

    // Verificar si el usuario tiene otros SportCenters publicados
    const publishedSportCenters =
      await this.sportcenterRepository.countPublishedSportCenters(user.id);

    if (publishedSportCenters === 0) {
      // Si no tiene más SportCenters publicados, eliminar el rol de manager
      user.role = UserRole.USER; // Ajustar según la lógica de roles de tu aplicación
      await this.userRepository.save(user);
    }

    return `SportCenter con ID ${id} eliminado correctamente.`;
  }

  async activateSportCenter(
    userId: string,
    sportCenterId: string,
  ): Promise<SportCenter> {
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

    if (found_sportcenter.sport_category.length===0 || found_sportcenter.field.length===0)
      throw new BadRequestException('Faltan rellenar campos');

    return await this.sportcenterRepository.activateSportCenter(
      found_sportcenter,
    );
  }

  async disableSportCenter(
    userId: string,
    sportCenterId: string,
  ): Promise<SportCenter> {
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
