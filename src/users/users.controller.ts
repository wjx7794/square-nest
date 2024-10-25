import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './config/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description 查询全部
   * @API POST => /users/searchAll
   * @returns
   */
  @Post('searchAll')
  findAll() {
    return this.usersService.findAll();
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
  edit(@Body() user: User) {
    return this.usersService.edit(user);
  }

  /**
   * @description 指定查询
   * @API POST => /users/searchOne
   * @returns
   */
  @Post('searchOne')
  findOne(@Body() user: User) {
    return this.usersService.findOne(user);
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
