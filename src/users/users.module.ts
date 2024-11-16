// 内部模块
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 外部模块
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/config/user.entity';

@Module({
  // 使用 forFeature() 方法定义在当前范围中注册哪些存储库
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // 如果要在导入TypeOrmModule.forFeature 的模块之外使用存储库，则需要重新导出由其生成的提供程序
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
