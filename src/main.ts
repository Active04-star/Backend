import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './helpers/http-exception.filter';
//
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
//
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Active Api')
    .setDescription('Active Api documentacion, rutas, DTOs y entidades')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*', // Permite cualquier origen
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true, // Si usas cookies o sesiones
  });



  await app.listen(4000);
}
bootstrap();
