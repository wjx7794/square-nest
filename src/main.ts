// 内部模块
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import * as cookieParser from 'cookie-parser';
// 外部模块
import { logger } from '@/common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用 cookie-parser 中间件并设置签名密钥
  app.use(cookieParser('dbc'));
  // 打印访问日志
  app.use(logger);
  await app.listen(3000);
}

bootstrap();
