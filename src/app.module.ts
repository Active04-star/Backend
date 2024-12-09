import { Module } from '@nestjs/common';import TypeOrmConfig from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    load: [TypeOrmConfig],
  }),

  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      configService.get('typeorm'),
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
