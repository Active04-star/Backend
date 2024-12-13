import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from './config/database.config';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from './uploads/upload.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Sport_Center_Module } from './modules/sport-center/sport-center.module';
import { Sport_Cateogry_Module } from './modules/sport-category/sport-category.module';
import { Field_Module } from './modules/field/field.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeOrmConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),

    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get('NODEMAILER_USER'),
            pass: configService.get('NODEMAILER_PASSWORD'),
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
         // Para desarrollo
          dir: join(__dirname, '..', 'src/templates'),

          // Para producción
          // dir: process.env.NODEMAILER_TEMPLATE_PATH,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    
    UploadModule,
    Sport_Center_Module,
    AuthModule,
    UserModule,
    Sport_Cateogry_Module,
    Field_Module,
    UploadModule,
      

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
