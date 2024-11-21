// 内部模块
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 外部模块
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
  async searchAll(): Promise<User[]> {
    try {
      const info = await this.usersRepository.find();
      return info;
    } catch (e) {
      throwError({ errMsg: '查询所有用户失败' });
    }
  }

  // 2. 新建用户
  async create(user: User): Promise<any> {
    const { userName, password } = user || {};
    // 2.1 参数缺失
    if (!userName || !password) {
      throw new HttpException('创建失败，缺少必要参数', HttpStatus.FORBIDDEN);
    }
    // 2.2 查询是否存在
    const exist = await this.usersRepository.findOne({
      where: {
        userName,
      },
    });
    if (exist) {
      throw new HttpException('创建失败，用户名已存在', HttpStatus.FORBIDDEN);
    }
    // 2.3 校验通过，则创建
    await this.usersRepository.save(user);
    return user;
  }

  // 3. 编辑用户
  async edit(user): Promise<any> {
    const { userName, password, newUserName, newPassword } = user || {};
    // 3.1 参数缺失
    if (!userName || !password) {
      throw new HttpException('编辑失败，缺少旧信息', HttpStatus.FORBIDDEN);
    }
    if (!newUserName || !newPassword) {
      throw new HttpException('编辑失败，缺少新信息', HttpStatus.FORBIDDEN);
    }

    // 3.2 查询新用户名是否存在
    const info = await this.usersRepository.findOne({
      where: {
        userName,
        password,
      },
    });
    if (!info) {
      throw new HttpException('编辑失败，用户信息错误', HttpStatus.FORBIDDEN);
    }

    // 3.3 查询新用户名是否存在
    const exist = await this.usersRepository.findOne({
      where: {
        userName: newUserName,
      },
    });
    if (exist) {
      throw new HttpException('编辑失败，新用户名已存在', HttpStatus.FORBIDDEN);
    }

    // 3.4 校验通过，则更新数据
    info.userName = newUserName;
    info.password = newPassword;
    await this.usersRepository.save(info);
    return user;
  }

  // 4. 查询指定用户
  async searchOne(user: User): Promise<any> {
    const { userId } = user || {};

    try {
      // 1. 参数缺失
      if (!userId) {
        throw new HttpException('缺少必要参数', HttpStatus.FORBIDDEN);
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
      if (res) {
        return res;
      }
      return '暂无数据';
    } catch (e) {
      const errorText = e?.message || '查询失败';
      throw new HttpException(errorText, HttpStatus.FORBIDDEN);
    }
  }

  // 删除
  async remove(user: User): Promise<any> {
    const { userId } = user || {};

    try {
      // 1. 参数缺失
      if (!userId) {
        throw new HttpException('缺少必要参数', HttpStatus.FORBIDDEN);
      }

      // 2. 查询是否存在
      const exist = await this.usersRepository.findOne({
        where: {
          userId,
        },
      });
      if (!exist) {
        throw new HttpException('用户名不存在', HttpStatus.FORBIDDEN);
      }

      // 3. 存在才能删除
      await this.usersRepository.remove(exist);
      return '删除成功';
    } catch (e) {
      const errorText = e?.message || '删除失败';
      throw new HttpException(errorText, HttpStatus.FORBIDDEN);
    }
  }

  // 登陆认证
  async verify(user: Partial<User>): Promise<any> {
    const { userName, password } = user || {};

    try {
      // 1. 参数缺失
      if (!userName || !password) {
        throw new HttpException('缺少必要参数', HttpStatus.FORBIDDEN);
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
      // if (res) {
      //   return res;
      // }
      // return '暂无数据';
      return res;
    } catch (e) {
      const errorText = e?.message || '查询失败';
      throw new HttpException(errorText, HttpStatus.FORBIDDEN);
    }
  }
}
