// 内部模块
import { HttpException, HttpStatus } from '@nestjs/common';
// 外部模块
import { SuccessCodeEnum } from './config';
import type { ITransformDataProps } from './config';

// 通用错误
export const transformData = (props: ITransformDataProps) => {
  const {
    message = '',
    success = true,
    code = SuccessCodeEnum.SUCCESS,
    ...rest
  } = props || {};
  return {
    code,
    success,
    message,
    data: {
      ...rest,
    },
  };
};
