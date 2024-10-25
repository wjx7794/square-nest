import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './config/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  // 查询所有
  async search(searchParams): Promise<Blog[]> {
    const info = await this.blogRepository.find();
    if (Array.isArray(info) && info.length) {
      return info;
    }
    return [];
  }

  // 新建
  async add(blog: Blog): Promise<any> {
    const { blogContent, blogName } = blog || {};
    // 1. 参数缺失
    if (!blogContent || !blogName) {
      throw new HttpException('缺少必要参数', HttpStatus.FORBIDDEN);
    }
    // 2. 查询是否存在
    // const exist = await this.blogRepository.findOne({
    //   where: {
    //     userName,
    //   },
    // });
    // if (exist) {
    //   throw new HttpException('创建失败，用户名已存在', HttpStatus.FORBIDDEN);
    // }
    // 3. 校验通过，则创建
    await this.blogRepository.save(blog);
    return blog;
  }

  // 编辑
  async edit(blog: Blog): Promise<any> {
    const { blogContent, blogName } = blog || {};
    // 1. 参数缺失
    if (!blogContent || !blogName) {
      throw new HttpException('缺少必要参数', HttpStatus.FORBIDDEN);
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
    // 3. 校验通过，则编辑
    await this.blogRepository.save(blog);
    return blog;
  }

  // 查询指定项
  async searchOne(blog: Blog): Promise<any> {
    const { blogId } = blog || {};

    try {
      // 1. 参数缺失
      if (!blogId) {
        throw new HttpException('缺少必要参数', HttpStatus.FORBIDDEN);
      }

      // 2. 关联查询
      const res = await this.blogRepository.findOne({
        where: {
          blogId,
        },
        // select: ['id', 'photos'],
        // where: {
        //   blogs: {
        //     userId,
        //   },
        // },
        relations: ['user'], // 关联字段
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
  async remove(blog: Blog): Promise<any> {
    const { blogId } = blog || {};

    try {
      // 1. 参数缺失
      if (!blogId) {
        throw new HttpException('缺少必要参数', HttpStatus.FORBIDDEN);
      }

      // 2. 查询是否存在
      const exist = await this.blogRepository.findOne({
        where: {
          blogId,
        },
      });
      if (!exist) {
        throw new HttpException('blog不存在', HttpStatus.FORBIDDEN);
      }

      // 3. 存在才能删除
      await this.blogRepository.remove(exist);
      return '删除成功';
    } catch (e) {
      const errorText = e?.message || '删除失败';
      throw new HttpException(errorText, HttpStatus.FORBIDDEN);
    }
  }
}
