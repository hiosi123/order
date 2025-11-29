import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Sije")
    .setDescription('발주 관리 시스템 API 문서')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addTag('Auth', '인증 관련 API')
    .addTag('Orders', '주문 관련 API')
    .addTag('Buyers', '구매자 관련 API')
    .addTag('Employees', '직원 관련 API')
    .addTag('Departments', '부서 관련 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Swagger documentation: http://localhost:3000/api');

}
bootstrap();
