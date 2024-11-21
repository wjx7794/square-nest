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

  /**
   * @description 登陆
   * @API POST => /auth/login
   * @returns
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Res({ passthrough: true }) res: Response, @Body() user: LoginUserDTO) {
    return this.authService.login(user, res);
  }

  /**
   * @description 退出登陆
   * @API POST => /auth/logout
   * @returns
   */
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  /**
   * @description 查看 cookie (本地调试)
   * @API POST => /auth/viewCookie
   * @returns
   */
  @Get('viewCookie')
  viewCookie(@Request() req) {
    return this.authService.viewCookie(req);
  }
}
