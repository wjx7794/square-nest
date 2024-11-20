import { registerAs } from '@nestjs/config';

export default registerAs('GLOBAL', () => ({
  // 项目启动端口
  PORT: process.env.PORT || 3000,
  // 数据库配置
  DATABASE: {
    // 数据库类型
    type: 'mysql',
    // 数据库 host
    host: 'localhost',
    // 数据库端口。mysql 默认的端口是3306.
    port: 3306,
    // 数据库用户名
    username: 'root',
    // 数据库密码
    password: '123456',
    // 数据库名
    database: 'square',
  },
}));
