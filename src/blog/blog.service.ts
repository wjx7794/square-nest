import { Injectable } from '@nestjs/common';
// import { Cat } from './interfaces/cat.interface';

@Injectable()
export class BlogService {
  // private readonly blogs: Cat[] = [];

  findAll() {
    return 'list =>';
  }

  detail() {
    return 'detail =>';
  }
}
