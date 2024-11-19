// 内部模块
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
// 外部模块
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { BlogModule } from '@/blog/blog.module';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { ValidationPipe } from '@/common/pipe/validation.pipe';

@Module({
  imports: [
    // 博客
    BlogModule,
    // 用户
    UsersModule,
    /**
     * 数据库
     * 常用连接选项: https://www.typeorm.net/connection-options
     */
    TypeOrmModule.forRoot({
      // 数据库类型
      type: 'mysql',
      // 数据库 host
      host: 'localhost',
      // 数据库端口。mysql 默认的端口是3306.
      port: 3306,
      // 数据库用户名
      username: 'root',
      // 数据库密码
      password: '123456',
      // 数据库名
      database: 'square',
      // 自动载入实体: 每个通过 forFeature() 注册的实体都会自动添加到配置对象的 entities 数组中。
      autoLoadEntities: true,
      // 设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
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
