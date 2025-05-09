// 内部模块
import { Controller, Post, Body } from '@nestjs/common';
// 外部模块
import { BlogService } from '@/blog/blog.service';
import { Blog } from '@/blog/config/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  /**
   * @description 1. 列表查询
   * @API POST => /blog/search
   * @param searchParams {
   *  // 关键词
   *  keyword: '',
   *  // 分类
   *  classify: '',
   *  // 排序
   *  sort: '',
   * }
   * @returns
   */
  @Post('search')
  search(@Body() searchParams) {
    return this.blogService.search(searchParams);
  }

  /**
   * @description 2. 新增
   * @API POST => /blog/add
   * @param searchParams {
   *  // 创建时间
   *  createTime: '',
   *  // 编辑时间
   *  editTime: '',
   *  // 内容信息
   *  blogContent: '',
   *  // 分类
   *  classify: '',
   *  // 标题名称
   *  blogName: '',
   * }
   * @returns
   */
  @Post('add')
  add(@Body() blog: Blog) {
    return this.blogService.add(blog);
  }

  /**
   * @description 3. 编辑
   * @API POST => /blog/edit
   * @returns
   */
  @Post('edit')
  edit(@Body() blog: Blog) {
    return this.blogService.edit(blog);
  }

  /**
   * @description 4. 指定查询
   * @API POST => /blog/searchOne
   * @returns
   */
  @Post('searchOne')
  searchOne(@Body() searchParams) {
    return this.blogService.searchOne(searchParams);
  }

  /**
   * @description 5. 删除指定
   * @API POST => /blog/remove
   * @returns
   */
  @Post('remove')
  remove(@Body() searchParams) {
    return this.blogService.remove(searchParams);
  }
}
