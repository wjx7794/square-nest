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
  UseInterceptors,
} from '@nestjs/common';
// 外部模块
import { LoggingInterceptor } from '@/common/interceptor/logger.interceptor';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/auth/config/decorator';
import { LoginUserDTO } from '@/auth/config/auth.dto';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. 登陆
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Res({ passthrough: true }) res: Response, @Body() user: LoginUserDTO) {
    return this.authService.login(user, res);
  }

  // 2. 退出登陆
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  // 3. 查看 cookie (本地调试)
  @Get('viewCookie')
  viewCookie(@Request() req) {
    return this.authService.viewCookie(req);
  }
}
