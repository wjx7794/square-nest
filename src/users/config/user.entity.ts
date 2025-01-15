/**
 * 参考: [https://juejin.cn/post/7132687601844092965] (class-validator注释集合)
 */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Blog } from '@/blog/config/blog.entity';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@Entity()
export class User {
  // 主键ID
  @PrimaryGeneratedColumn()
  id: number;

  // 用户ID
  @Column({ default: '' })
  @IsOptional()
  @IsString()
  userId: string;

  // 用户名
  @Column()
  @IsNotEmpty()
  userName: string;

  // 密码
  @Column()
  @IsNotEmpty()
  password: string;

  // 头像url
  @Column({ default: '' })
  @IsOptional()
  @IsString()
  avatar: string;

  // 关联的 blogs
  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];
}
