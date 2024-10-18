import { Controller, Post, Body } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  // POST => http://localhost:3000/list/
  @Post('list')
  list(@Body() searchParams) {
    console.log(searchParams); // { name: 'Jack'xxx, age: '28' }
    return this.blogService.findAll();
  }
}
