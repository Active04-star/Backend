import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { SportCenter_Module } from './modules/sport-center/sport-center.module';
import { Sport_Cateogry_Module } from './modules/sport-category/sport-category.module';
import { Field_Module } from './modules/field/field.module';
import { ReviewModule } from './modules/review/review.module';
import { ImagesModule } from './modules/images/images.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { AdminModule } from './modules/Admin/admin.module';
import { Auth0Module } from './modules/auth0/auth0.module';
import { Payment_Module } from './modules/payment/payment.module';
import { Subscription_Module } from './modules/subscription/subscription.module';
import { Reservation_Module } from './modules/reservation/reservation.module';
import { SportCenter_Schedule_Module } from './modules/sportcenter_schedules/sportCenter_schedule.module';
import { ManagerModule } from './modules/manager/manager.module';
import { Field_Block_Module } from './modules/field_blocks/field_schedule.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleTaskModule } from './modules/task/task.module';
import { notificationGateway } from './modules/notification.gateway.ts/websocket.gateway';
import { IllegalUserMiddleware } from './middlewares/IllegalUser.middleware';

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

    ScheduleModule.forRoot(),

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

    Auth0Module,
    ImagesModule,
    UploadModule,
    SportCenter_Module,
    AuthModule,
    UserModule,
    Sport_Cateogry_Module,
    Field_Module,
    UploadModule,
    ReviewModule,
    AdminModule,
    Payment_Module,
    Subscription_Module,
    Reservation_Module,
    SportCenter_Schedule_Module,
    ManagerModule,
    Field_Block_Module,
    ScheduleTaskModule,
    notificationGateway
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IllegalUserMiddleware).forRoutes('*');
  }
}