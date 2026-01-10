import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global exception filter (after interceptors)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('admin/v1');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('Admin API documentation')
    .setVersion('1.0')
    .addTag('admin')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI
  SwaggerModule.setup('admin/v1/api-docs', app, document, {
    jsonDocumentUrl: 'admin/v1/api-docs/json',
    yamlDocumentUrl: 'admin/v1/api-docs/yaml',
  });

  // Export swagger.json
  const outputPath = path.resolve(process.cwd(), 'swagger');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  fs.writeFileSync(
    path.resolve(outputPath, 'swagger.json'),
    JSON.stringify(document, null, 2),
    { encoding: 'utf8' }
  );

  // Export swagger.yaml
  fs.writeFileSync(
    path.resolve(outputPath, 'swagger.yaml'),
    yaml.dump(document, { sortKeys: true }),
    { encoding: 'utf8' }
  );

  console.log('Swagger JSON: http://localhost:3000/admin/v1/api-docs/json');
  console.log('Swagger YAML: http://localhost:3000/admin/v1/api-docs/yaml');
  console.log('Swagger UI: http://localhost:3000/admin/v1/api-docs');

  await app.listen(process.env.PORT ?? 3001);   
}
bootstrap();
