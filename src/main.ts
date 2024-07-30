import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { environment } from './env/envoriment';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setBaseViewsDir(join(__dirname + '/public'));
  app.setViewEngine('hbs');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Email Api')
    .setDescription('Tecnologias: Nestjs, Swagger, Prisma, Postgres e Docker')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(environment.appPort || 3000, () =>
    console.log(
      `App is Running http://localhost:${environment.appPort}/api-docs`,
    ),
  );
}
bootstrap();
