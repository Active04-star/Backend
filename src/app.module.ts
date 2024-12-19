import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from './config/database.config';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from './modules/uploads/upload.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Sport_Center_Module } from './modules/sport-center/sport-center.module';
import { Sport_Cateogry_Module } from './modules/sport-category/sport-category.module';
import { Field_Module } from './modules/field/field.module';
import { ReviewModule } from './modules/review/review.module';
import { ImagesModule } from './modules/images/images.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { AdminModule } from './modules/Admin/admin.module';


@Module({
  imports: [
    StripeModule.forRootAsync(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
          dir: join(__dirname, 'templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    ImagesModule,
    UploadModule,
    Sport_Center_Module,
    AuthModule,
    UserModule,
    Sport_Cateogry_Module,
    Field_Module,
    UploadModule,
    ReviewModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
