import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@/auth/config/decorator';

const sleep = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('list')
  async getList(@Query() query) {
    console.log('🍏query', query);

    // 1. 正常
    return {
      data: [{ name: 'Jack', age: 26 }],
      success: true,
      code: 0,
    };

    // 2.1 异常
    // throw new HttpException(
    //   {
    //     status: HttpStatus.NOT_FOUND, // 404
    //     error: 'This is a custom message',
    //   },
    //   HttpStatus.FORBIDDEN, // 403
    // );

    // 2.2 异常
    // return {
    //   data: [{ name: 'Jack', age: 26 }],
    //   success: false,
    //   code: 0,
    //   message: '请求异常来自后端',
    // };

    // 3. 超时
    // await sleep(2000);
  }
}
