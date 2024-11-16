import { HttpStatus } from '@nestjs/common';

// 通用错误-枚举
export enum ErrorCodeEnum {
  DEFAULT = 0,
}

// 通用错误
export interface IthrowErrorProps {
  errMsg: string;
  success?: boolean;
  statusCode?: HttpStatus;
  code?: ErrorCodeEnum;
}
