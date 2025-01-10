// 内部模块
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// 外部模块
import { UsersService } from '@/users/users.service';
import { throwError } from '@/common/utils/errorHandle';
import { transformData } from '@/common/utils/successHandle';
import { LoginUserDTO } from '@/auth/config/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    // 注入「用户服务」
    private usersService: UsersService,
    // 注入「Jwt服务」
    private jwtService: JwtService,
  ) {}

  // 1. 登陆
  async login(user: LoginUserDTO, res): Promise<any> {
    // 1. 将用户的账号密码与数据库比对
    const userInfo = await this.usersService.verify(user);

    // 2. 数据库无用户信息，则登陆失败，抛出错误
    if (!userInfo) {
      throwError({ errMsg: '账号密码错误' });
    }

    // 3. 登陆成功，则生成 token (从用户属性的子集中生成 JWT)
    const accessToken = await this.jwtService.signAsync({
      sub: userInfo.userId,
      username: userInfo.username,
    });

    // 4. 将生成的 token 存入 cookie 中
    const passport = {
      accessToken,
      userInfo: {
        userId: userInfo?.userId,
        userName: userInfo?.userName,
      },
    };
    res.cookie('passport', passport, {
      // JS脚本无法读取 cookie 信息，防止 XSS 攻击
      httpOnly: true,
      // 设为 true 即对该 cookie 签名
      signed: true,
      // 过期时间，从现在开始算
      maxAge: 1000 * 60 * 60,
    });

    // 5. 返回可读信息
    return transformData({
      userInfo,
      accessToken,
      message: '登陆成功',
    });
  }

  // 2. 退出登陆
  async logout(res): Promise<any> {
    // 删除 token 的 cookie
    res.clearCookie('passport');
    // 返回结果
    return transformData({
      message: '退出登陆成功',
    });
  }

  // 3. 查看 cookie (本地调试)
  async viewCookie(req): Promise<any> {
    // 返回结果
    return transformData({
      ...(req.signedCookies || {}),
      message: '查看 cookie 成功',
    });
  }
}
