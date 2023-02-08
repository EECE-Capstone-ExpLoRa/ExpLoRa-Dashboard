import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const PORT: number = configService.get<number>('PORT') || 3000;

  const config = new DocumentBuilder()
    .setTitle('ExpLorRa Documentation')
    .setDescription('Api Documentation for the ExpLoRa group for CapStone')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}
bootstrap();
