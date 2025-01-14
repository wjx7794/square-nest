import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/config/user.entity';

@Entity()
export class Blog {
  // 主键
  @PrimaryGeneratedColumn()
  id: number;

  // 文章ID
  @Column()
  blogId: string;

  // 文章标题
  @Column()
  blogName: string;

  // 文章内容
  @Column()
  blogContent: string;

  // 创建时间
  @Column({ type: 'datetime', default: null })
  createTime: Date;

  // 编辑时间
  @Column({ type: 'datetime', default: null })
  editTime: Date;

  // 文章分类
  @Column({ default: '' })
  classify: string;

  /**--------------------------------- 关联信息 start --------------------------------------*/
  // userId
  @Column()
  userId: string;

  // 关联 user
  @ManyToOne(() => User, (user) => user.blogs)
  user: User;
  /**--------------------------------- 关联信息 end ----------------------------------------*/
}
