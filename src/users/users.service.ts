// 内部模块
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v7 as uuidV7 } from 'uuid';
// 外部模块
import { transformData } from '@/common/utils/successHandle';
import { throwError } from '@/common/utils/errorHandle';
import { User } from '@/users/config/user.entity';

@Injectable()
export class UsersService {
  // @InjectRepository()装饰器将 UsersRepository 注入到 UsersService 中
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. 查询所有用户
  async searchAll(): Promise<any> {
    try {
      const userList = await this.usersRepository.find();
      return transformData({
        message: '查询所有用户成功',
        userList,
      });
    } catch (e) {
      throwError({ errMsg: '查询所有用户失败' });
    }
  }

  // 2. 新建用户
  async create(user: User): Promise<any> {
    const { userName, password, avatar } = user || {};

    // 2.1 参数缺失
    if (!userName || !password) {
      throwError({ errMsg: '创建失败，缺少必要参数' });
    }

    // 2.2 查询用户名是否存在
    const exist = await this.usersRepository.findOne({
      where: {
        userName,
      },
    });
    if (exist) {
      throwError({ errMsg: '创建失败，用户名已存在' });
    }

    // 2.3 生成 userId 并查询是否存在
    const newUserId = uuidV7();
    const hasId = await this.usersRepository.findOne({
      where: {
        userId: newUserId,
      },
    });
    if (hasId) {
      throwError({ errMsg: '服务繁忙，请重试' });
    }

    // 2.4 校验通过，则创建
    const newUser = {
      userId: newUserId,
      userName,
      password,
      avatar,
    };
    await this.usersRepository.save(newUser);
    return transformData({
      message: '创建成功',
      ...newUser,
    });
  }

  // 3. 编辑用户
  async edit(user): Promise<any> {
    const { userName, password, newUserName, newPassword } = user || {};

    // 3.1 参数缺失
    if (!userName || !password) {
      throwError({ errMsg: '创建失败，旧账号名称或密码不能为空' });
    }
    if (!newUserName || !newPassword) {
      throwError({ errMsg: '创建失败，新账号名称或密码不能为空' });
    }

    // 3.2 校验旧账号是否登陆成功
    const info = await this.usersRepository.findOne({
      where: {
        userName,
        password,
      },
    });
    if (!info) {
      throwError({ errMsg: '编辑失败，旧账号名称或密码错误' });
    }

    // 3.3 查询新用户名是否存在
    if (userName !== newUserName) {
      const exist = await this.usersRepository.findOne({
        where: {
          userName: newUserName,
        },
      });
      if (exist) {
        throwError({ errMsg: '编辑失败，新用户名已存在' });
      }
    }

    // 3.4 校验通过，则更新数据
    info.userName = newUserName;
    info.password = newPassword;
    await this.usersRepository.save(info);
    return transformData({
      message: '修改个人信息成功',
      ...(user || {}),
    });
  }

  // 4. 查询指定用户
  async searchOne(user: User): Promise<any> {
    const { userId } = user || {};

    // 1. 参数缺失
    if (!userId) {
      throwError({ errMsg: '缺少必要参数' });
    }

    // 2. 关联查询
    const res = await this.usersRepository.findOne({
      // where: {
      //   id,
      // },
      // select: ['id', 'photos'],
      where: {
        blogs: {
          userId,
        },
      },
      relations: ['blogs'], // 关联字段
    });

    // 2.1 查询到结果
    if (res) {
      const { userId, userName, avatar, blogs } = res;
      return transformData({
        message: '查询用户成功',
        // data 包含如下
        userId,
        userName,
        avatar,
        blogs,
      });
    }

    // 2.2 查询不到结果
    return transformData({
      message: '暂无数据',
    });
  }

  // 5. 删除
  async remove(user: User): Promise<any> {
    const { userName, password } = user || {};

    // 5.1 参数缺失
    if (!userName || !password) {
      throwError({ errMsg: '创建失败，缺少必要参数' });
    }

    // 5.2 校验旧账号是否登陆成功
    const info = await this.usersRepository.findOne({
      where: {
        userName,
        password,
      },
    });
    if (!info) {
      throwError({ errMsg: '账号名称或密码错误' });
    }

    // 5.3 存在才能删除
    await this.usersRepository.remove(info);
    return transformData({
      message: '删除成功',
    });
  }

  // 6. 登陆认证
  async verify(user: Partial<User>): Promise<any> {
    const { userName, password } = user || {};

    // 1. 参数缺失
    if (!userName || !password) {
      throwError({ errMsg: '验证失败，缺少必要参数' });
    }

    // 2. 关联查询
    const res = await this.usersRepository.findOne({
      where: {
        userName,
        password,
      },
      // select: ['id', 'photos'],
      // where: {
      //   blogs: {
      //     userId,
      //   },
      // },
      // relations: ['blogs'], // 关联字段
    });

    return res;
  }
}
