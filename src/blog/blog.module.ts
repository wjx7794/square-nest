// 内部模块
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 外部模块
import { BlogController } from '@/blog/blog.controller';
import { BlogService } from '@/blog/blog.service';
import { UsersModule } from '@/users/users.module';
import { Blog } from '@/blog/config/blog.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Blog])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
