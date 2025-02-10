// 内部模块
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
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

  // 压缩以减小响应主体的大小
  app.use(compression());

  // 允许跨域
  app.enableCors({
    credentials: true,
    origin(origin, callback) {
      callback(null, true);
    },
  });

  // 设置限速，每个IP地址每分钟最多允许50个请求
  app.use(
    rateLimit({
      // 限制窗口的持续时间(以毫秒为单位)
      windowMs: 60 * 1000,
      // 在给定窗口持续时间内可以发出的最大请求数
      limit: 50,
      // 用户在超出限制时收到的响应消息
      message: '请求过于频繁，请稍后再试',
      // 响应头上展示剩余次数
      headers: true,
    }),
  );

  // 监听端口启动
  await app.listen(PORT);
}

bootstrap();
