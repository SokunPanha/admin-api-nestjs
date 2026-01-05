import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('admin/v1');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('Admin API documentation')
    .setVersion('1.0')
    .addTag('admin')
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
