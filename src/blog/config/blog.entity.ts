import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '@/users/config/user.entity';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

@Entity()
export class Blog {
  // 主键
  @PrimaryGeneratedColumn()
  id: number;

  // 文章ID
  @Column({ default: '' })
  @IsOptional()
  @IsString()
  blogId: string;

  // 文章标题
  @Column()
  @IsString()
  @IsNotEmpty()
  blogName: string;

  // 文章内容
  @Column()
  @IsString()
  @IsNotEmpty()
  blogContent: string;

  // 创建时间
  @Column({ default: null })
  @IsNumberString()
  createTime: string;

  // 编辑时间
  @Column({ default: null })
  @IsNumberString()
  editTime: string;

  // 文章分类
  @Column({ default: '' })
  @IsString()
  @IsNotEmpty()
  classify: string;

  /**--------------------------------- 关联信息 start --------------------------------------*/
  // userId
  @Column()
  @IsString()
  @IsNotEmpty()
  userId: string;

  // 关联 user
  @ManyToOne(() => User, (user) => user.blogs)
  user: User;
  /**--------------------------------- 关联信息 end ----------------------------------------*/
}
