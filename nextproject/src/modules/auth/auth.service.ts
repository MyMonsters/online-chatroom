import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RCode } from 'src/common/constant/Rcode';

Injectable();
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validate(username: string, password: string): Promise<any> {
    if (!username || !password) {
      return false;
    }
    return { username, password };
  }
  async login(data: User) {
    const user = await this.userRepository.findOne({
      where: { username: data.username, password: data.password },
    });
    console.log('user', data.username);
    if (!user) {
      return { code: RCode.FAIL, msg: '账号或密码错误！' };
    }
    //把从数据库中查到的password改成输入的password
    user.password = data.password;
    const payload = { userId: user.userId, password: user.password };
    return {
      code: RCode.OK,
      msg: '登录成功！',
      data: {
        user,
        token: this.jwtService.sign(payload),
      },
    };
  }
  async register(data: User) {
    console.log(data);
    const user = await this.userRepository.findOne({
      where: { username: data.username },
    });
    if (user) {
      return { code: RCode.FAIL, msg: '用户名重复！' };
    }

    const newUser = await this.userRepository.save(data);
    newUser.avatar = 'http://localhost:3000/static/default.png';
    newUser.nickname = '用户' + newUser.userId;
    const payload = { userId: newUser.userId, password: newUser.password };
    return {
      code: RCode.OK,
      msg: '注册成功！',
      data: {
        user: newUser,
        token: this.jwtService.sign(payload),
      },
    };
  }
}
