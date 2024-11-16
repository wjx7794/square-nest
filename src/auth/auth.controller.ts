// 内部模块
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  Res,
} from '@nestjs/common';
// 外部模块
import { AuthService } from '@/auth/auth.service';
import { User } from '@/users/config/user.entity';
import { Public } from '@/auth/config/decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. 登陆
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Res({ passthrough: true }) res: Response, @Body() user: User) {
    return this.authService.login(user, res);
  }

  // 2. 退出登陆
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  // 3. 查看 cookie (本地调试)
  @Get('viewCookie')
  getProfile(@Request() req) {
    return req.signedCookies;
  }
}
