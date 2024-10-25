import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './config/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 查询所有
  async findAll(): Promise<User[]> {
    const info = await this.usersRepository.find();
    if (Array.isArray(info) && info.length) {
      return info;
    }
    return [];
  }

  // 新建
  async create(user: User): Promise<any> {
    const { userName, password } = user || {};
    // 1. 参数缺失
    if (!userName || !password) {
      throw new HttpException('创建失败，缺少必要参数', HttpStatus.FORBIDDEN);
    }
    // 2. 查询是否存在
    const exist = await this.usersRepository.findOne({
      where: {
        userName,
      },
    });
    if (exist) {
      throw new HttpException('创建失败，用户名已存在', HttpStatus.FORBIDDEN);
    }
    // 3. 校验通过，则创建
    await this.usersRepository.save(user);
    return user;
  }

  // 编辑
  async edit(user: User): Promise<any> {
    const { userName, password } = user || {};
    // 1. 参数缺失
    if (!userName || !password) {
      throw new HttpException('编辑失败，缺少必要参数', HttpStatus.FORBIDDEN);
    }
    // 2. 查询是否存在
    // const exist = await this.usersRepository.findOne({
    //   where: {
    //     userName,
    //   },
    // });
    // if (exist) {
    //   throw new HttpException('编辑失败，用户名已存在', HttpStatus.FORBIDDEN);
    // }
    // 3. 校验通过，则创建
    await this.usersRepository.save(user);
    return user;
  }

  // 查询指定项
  async findOne(user: User): Promise<any> {
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
}
