import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './friend.entity';
import { FriendMessage } from './friendMessage.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendMessage)
    private readonly friendMessageRepository: Repository<FriendMessage>,
    private readonly datasource: DataSource,
  ) {}
  async getFriends(userId: number) {
    console.log(userId);
    if (userId) {
      return {
        msg: '获取用户好友信息成功！',
        data: await this.friendRepository.find({ where: { userId: userId } }),
      };
    }
  }
  async getFriendMessages(
    userId: number,
    friendId: number,
    current: number,
    pageSize: number,
  ) {
    const messages = await this.datasource
      .getRepository(FriendMessage)
      .createQueryBuilder('friendMessage')
      .orderBy('friendMessage.time', 'DESC')
      .where(
        'friendMessage.userId = :userId And friendMessage.friendId = :friendId',
        { userId: userId, friendId: friendId },
      )
      .orWhere(
        'friendMessage.userId = :userId And friendMessage.friendId = :friendId',
        { userId: friendId, friendId: userId },
      )
      .skip(current)
      .take(pageSize)
      .getMany();
    return { msg: '', data: { messageArr: messages.reverse() } };
  }
}
