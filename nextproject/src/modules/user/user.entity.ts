import { Entity, Column, PrimaryGeneratedColumn, Double } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;
  @Column({ default: '昵称' })
  nickname: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({ default: 'avatar.png' })
  avatar: string;
  @Column({ default: 'online' })
  status: string;
  @Column({ type: 'double', default: new Date().valueOf() })
  createTime: number;
  @Column({ default: 'description' })
  desc: string;
}
