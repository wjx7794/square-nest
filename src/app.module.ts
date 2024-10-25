import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    BlogModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'square',
      // entities: [User, Photo],
      // 自动载入实体: 每个通过 forFeature() 注册的实体都会自动添加到配置对象的 entities 数组中。
      autoLoadEntities: true,
      // 设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
