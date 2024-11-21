// 内部模块
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
// 外部模块
import { User } from '@/users/config/user.entity';
import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
  // 注入用户服务
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description 查询全部
   * @API POST => /users/searchAll
   * @returns
   */
  @Post('searchAll')
  searchAll() {
    return this.usersService.searchAll();
  }

  /**
   * @description 新增
   * @API POST => /users/create
   * @returns
   */
  @Post('create')
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  /**
   * @description 编辑
   * @API POST => /users/edit
   * @returns
   */
  @Post('edit')
  edit(@Body() user) {
    return this.usersService.edit(user);
  }

  /**
   * @description 指定查询
   * @API POST => /users/searchOne
   * @returns
   */
  @Post('searchOne')
  findOne(@Body() user: User) {
    return this.usersService.searchOne(user);
  }

  /**
   * @description 删除指定
   * @API POST => /users/remove
   * @returns
   */
  @Post('remove')
  remove(@Body() user: User) {
    return this.usersService.remove(user);
  }
}
