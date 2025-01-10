// 内部模块
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
// 外部模块
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { BlogModule } from '@/blog/blog.module';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { ValidationPipe } from '@/common/pipe/validation.pipe';
import configuration from '@/config/configuration';

@Module({
  imports: [
    // 鉴权
    AuthModule,
    // 博客
    BlogModule,
    // 用户
    UsersModule,
    /**
     * 数据库
     * 常用连接选项: https://www.typeorm.net/connection-options
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { DATABASE } = configService.get('GLOBAL');
        return {
          // 数据库类型
          type: DATABASE.type,
          // 数据库 host
          host: DATABASE.host,
          // 数据库端口。mysql 默认的端口是3306.
          port: DATABASE.port,
          // 数据库用户名
          username: DATABASE.username,
          // 数据库密码
          password: DATABASE.password,
          // 数据库名
          database: DATABASE.database,
          // 自动载入实体: 每个通过 forFeature() 注册的实体都会自动添加到配置对象的 entities 数组中。
          autoLoadEntities: true,
          // 设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    /**
     * 配置
     */
    ConfigModule.forRoot({
      // 全局化，这样不需要每个模块都单独注入
      isGlobal: true,
      // 自定义配置文件
      load: [configuration],
    }),
  ],
  // 控制器
  controllers: [AppController],
  // 注入服务
  providers: [
    AppService,
    // 全局管道
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
