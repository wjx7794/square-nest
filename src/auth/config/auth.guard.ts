// 内部模块
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
// 外部模块
import { jwtConstants } from '@/auth/config/constants';
import { IS_PUBLIC_KEY } from '@/auth/config/decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // 注入Jwt服务
    private jwtService: JwtService,
    // 注入装饰器
    private reflector: Reflector,
  ) {}

  // 是否允许当前请求
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取装饰器 Public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 2. 公共方法可以直接绕开 token 执行
    if (isPublic) {
      return true;
    }
    // 3. 非公共方法，从请求中获取 cookie，没有签名的 cookie 值从请求的 cookies 获取
    const request = context.switchToHttp().getRequest();
    // 签名的 cookie 值从请求的 signedCookies 里获取
    const cookieValue = request.signedCookies;
    const { passport } = cookieValue || {};
    // 4. 没有 accessToken，直接返回失败
    if (!passport?.accessToken) {
      throw new UnauthorizedException();
    }
    // 5. 有 token，校验当前请求携带的 jwt 是否合法
    try {
      await this.jwtService.verifyAsync(passport?.accessToken, {
        secret: jwtConstants.secret,
      });
    } catch {
      throw new UnauthorizedException();
    }
    // 6. 通过所有校验，则能成功访问路由方法
    return true;
  }
}
