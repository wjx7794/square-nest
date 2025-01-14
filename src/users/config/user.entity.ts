import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Blog } from '../../blog/config/blog.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  userId: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({ default: '' })
  avatar: string;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];
}
