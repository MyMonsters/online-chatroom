import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RCode } from 'src/common/constant/Rcode';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async getUser(userId: number) {
    try {
      let data;
      if (userId) {
        this.usersRepository.findOne({ where: { userId: userId } });
        return {
          code: RCode.OK,
          msg: '获取用户成功',
          data,
        };
      }
    } catch (e) {
      return { code: RCode.ERROR, msg: '获取用户信息失败', data: e };
    }
  }
  async getUserByUsername(username: string) {
    console.log(username);
    try {
      if (username) {
        const data = await this.usersRepository.findOne({
          where: { username: username },
        });
        if (data) {
          return {
            code: RCode.OK,
            msg: '获取用户成功',
            data,
          };
        }
        return {
          code: RCode.FAIL,
          msg: '该用户不存在！',
        };
      }
    } catch (e) {
      return { code: RCode.ERROR, msg: '获取用户信息失败', data: e };
    }
  }
  async updateUser(user: User) {
    try {
      const oldUser = await this.usersRepository.findOne({
        where: { userId: user.userId },
      });
      await this.usersRepository.update(oldUser, user);
      const newUser = await this.usersRepository.findOne({
        where: { userId: user.userId },
      });
      return { code: RCode.OK, msg: '修改用户信息成功！', data: newUser };
    } catch (e) {
      return { code: RCode.ERROR, msg: '修改用户昵称失败！', data: e };
    }
  }
  async uploadAvatar(avatarUrl, userId) {
    try {
      const user = await this.usersRepository.findOne({
        where: { userId: userId },
      });
      const newUser = { ...user };
      newUser.avatar = avatarUrl;
      await this.usersRepository.update(user, newUser);
      return { code: RCode.OK, msg: '修改头像成功！', data: newUser };
    } catch (e) {
      return { code: RCode.ERROR, msg: '上传失败！', data: e };
    }
  }
}
