// 内部模块
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v7 as uuidV7 } from 'uuid';
// 外部模块
import { Blog } from '@/blog/config/blog.entity';
import { transformData } from '@/common/utils/successHandle';
import { throwError } from '@/common/utils/errorHandle';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  // 1. 查询所有
  async search(searchParams): Promise<any> {
    try {
      const infoList = await this.blogRepository.find();
      return transformData({
        message: '查询博客成功',
        infoList,
      });
    } catch (e) {
      throwError({ errMsg: '查询博客失败' });
    }
  }

  // 2. 新建
  async add(blog: Blog): Promise<any> {
    const { blogContent, blogName, userId, createTime, editTime, classify } =
      blog || {};

    try {
      // 2.1 参数缺失
      if (!blogContent || !blogName || !userId) {
        return transformData({
          message: '缺少必要参数',
          success: false,
        });
      }

      // 2.2 生成 blogId 并查询是否存在
      const newBlogId = uuidV7();
      const hasId = await this.blogRepository.findOne({
        where: {
          blogId: newBlogId,
        },
      });
      if (hasId) {
        return transformData({
          message: '服务繁忙，请重试',
          success: false,
        });
      }

      // 2.3 校验通过，则创建
      const newBlog = {
        blogContent,
        blogName,
        userId,
        createTime,
        editTime,
        classify,
        blogId: newBlogId,
      };
      await this.blogRepository.save(newBlog);
      return transformData({
        message: '创建博客成功',
        ...newBlog,
      });
    } catch (e) {
      throwError({ errMsg: '创建博客失败' });
    }
  }

  // 3. 编辑
  async edit(blog: Blog): Promise<any> {
    const { blogContent, blogName, blogId, userId, editTime, classify } =
      blog || {};

    try {
      // 3.1 参数缺失
      if (!blogContent || !blogName || !blogId || !userId) {
        return transformData({
          message: '缺少必要参数',
          success: false,
        });
      }

      // 3.2 查询当前博客是否存在
      const oldBlog = await this.blogRepository.findOne({
        where: {
          blogId,
        },
      });
      if (!oldBlog) {
        return transformData({
          message: '当前博客不存在',
          success: false,
        });
      }

      // 3.3 校验通过，则修改
      oldBlog.blogName = blogName;
      oldBlog.blogContent = blogContent;
      oldBlog.classify = classify;
      oldBlog.editTime = editTime;
      await this.blogRepository.save(oldBlog);
      return transformData({
        message: '编辑博客成功',
        ...oldBlog,
      });
    } catch (e) {
      throwError({ errMsg: '编辑博客失败' });
    }
  }

  // 4. 查询指定项
  async searchOne(searchParams): Promise<any> {
    const { blogId } = searchParams || {};

    try {
      // 4.1 参数缺失
      if (!blogId) {
        return transformData({
          message: '缺少必要参数',
          success: false,
        });
      }

      // 4.2 关联查询
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

      // 4.3 有查询结果
      if (res) {
        const { user, ...rest } = res || {};
        const { userId, userName, avatar } = user || {};
        return transformData({
          message: '查询指定博客成功',
          ...(rest || {}),
          user: {
            userId,
            userName,
            avatar,
          },
        });
      }

      // 4.4 无查询结果
      return transformData({
        message: '暂无数据',
      });
    } catch (e) {
      throwError({ errMsg: '查询指定博客失败' });
    }
  }

  // 5. 删除
  async remove(searchParams): Promise<any> {
    const { blogId } = searchParams || {};

    try {
      // 5.1 参数缺失
      if (!blogId) {
        return transformData({
          message: '缺少必要参数',
          success: false,
        });
      }

      // 5.2. 查询是否存在
      const exist = await this.blogRepository.findOne({
        where: {
          blogId,
        },
      });
      if (!exist) {
        return transformData({
          message: '博客不存在',
          success: false,
        });
      }

      // 5.3 存在才能删除
      await this.blogRepository.remove(exist);
      return transformData({
        message: '删除成功',
      });
    } catch (e) {
      throwError({ errMsg: '删除失败' });
    }
  }
}
