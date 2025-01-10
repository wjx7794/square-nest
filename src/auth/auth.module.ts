// 内部模块
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
// 外部模块
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { UsersModule } from '@/users/users.module';
import { jwtConstants } from '@/auth/config/constants';
import { AuthGuard } from '@/auth/config/auth.guard';

@Module({
  imports: [
    // 用户模块
    UsersModule,
    // Jwt模块
    JwtModule.register({
      global: true,
      // 用于加密
      secret: jwtConstants.secret,
      // 用来设置 token 的过期时间
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    // 权限服务
    AuthService,
    // 开启全局认证
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
