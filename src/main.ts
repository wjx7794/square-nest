// 内部模块
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
// 外部模块
import { logger } from '@/common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 获取环境配置
  const configService = app.get(ConfigService);
  const { PORT } = configService.get('GLOBAL');

  // 使用 cookie-parser 中间件并设置签名密钥
  app.use(cookieParser('dbc'));

  // 全局中间价，打印访问日志
  app.use(logger);

  // 对所有传入的「客户端有效负载」强制执行验证规则
  app.useGlobalPipes(new ValidationPipe());

  // 监听端口启动
  await app.listen(PORT);
}

bootstrap();
