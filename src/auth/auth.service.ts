import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/config/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    // 注入 JwtService
    private jwtService: JwtService,
  ) {}

  async signIn(user: User): Promise<any> {
    const userInfo = await this.usersService.verify(user);
    console.log('userInfo===>', userInfo);
    if (!userInfo) {
      throw new UnauthorizedException();
    }
    // const { password, ...result } = userInfo || {};
    // TODO: 生成一个 JWT，并在这里返回
    // 而不是返回一个用户对象
    // return userInfo;
    const payload = { sub: userInfo.userId, username: userInfo.username };
    return {
      // 从用户属性的子集中生成 JWT
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
