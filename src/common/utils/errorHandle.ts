// 内部模块
import { HttpException, HttpStatus } from '@nestjs/common';
// 外部模块
import { ErrorCodeEnum } from './config';
import type { IthrowErrorProps } from './config';

// 通用错误
export const throwError = (props: IthrowErrorProps) => {
  const {
    errMsg,
    success = false,
    statusCode = HttpStatus.OK,
    code = ErrorCodeEnum.DEFAULT,
  } = props || {};
  throw new HttpException(
    {
      code,
      success,
      errMsg,
    },
    statusCode,
  );
};
