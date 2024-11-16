import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用 cookie-parser 中间件并设置签名密钥
  app.use(cookieParser('dbc'));

  await app.listen(3000);
}

bootstrap();
