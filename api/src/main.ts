import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function boostrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*", // change this to the client url
      credentials: true,
    },
  });
  const config = new DocumentBuilder()
    .setTitle('AI Avatar API')
    .setDescription('The AI Avatar API description')
    .setVersion('1.0')
    .addTag('AI Avatar')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // app.enableCors();
  await app.listen(3000);
}
boostrap();




