import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Friend } from '../friend/friend.entity';
import { FriendMessage } from '../friend/friendMessage.entity';
import { RCode } from 'src/common/constant/Rcode';
import { userInfo } from 'os';

@WebSocketGateway({
  cors: {
    origin: 'http://101.34.205.91:3002',
    credentials: true,
  },
})
export class MessageGateway {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly FriendRepository: Repository<Friend>,
    @InjectRepository(FriendMessage)
    private readonly FriendMessageRepository: Repository<FriendMessage>,
    private readonly datasource: DataSource,
  ) {}

  @WebSocketServer()
  server: Server;
  async handleConnection(client: Socket): Promise<string> {
    const userRoom = client.handshake.query.userId;
    // 用户独有消息房间 根据userId
    if (userRoom) {
      client.join(userRoom);
    }
    return '连接成功';
  }

  // socket断连钩子
  // async handleDisconnect(): Promise<any> {
  //   this.getActiveGroupUser();
  // }
  @SubscribeMessage('addFriend')
  async addFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Friend,
  ) {
    console.log(JSON.parse(JSON.stringify(data)));
    const Userexist = await this.userRepository.findOne({
      where: { userId: data.userId },
    });
    const Friendexist = await this.userRepository.findOne({
      where: { userId: data.friendId },
    });
    if (!Friendexist) {
      this.server
        .to(data.userId.toString())
        .emit('addFriend', { code: RCode.FAIL, msg: '该用户不存在！' });
      return;
    }
    if (Userexist && data.userId && data.friendId) {
      if (data.userId === data.friendId) {
        this.server
          .to(data.userId.toString())
          .emit('addFriend', { code: RCode.FAIL, msg: '不能添加自己为好友！' });
        return;
      }
      const MetoFriend = await this.FriendRepository.findOne({
        where: { userId: data.userId, friendId: data.friendId },
      });
      const FriendtoMe = await this.FriendRepository.findOne({
        where: { userId: data.friendId, friendId: data.userId },
      });
      console.log(MetoFriend, FriendtoMe);
      const roomId =
        data.userId > data.friendId
          ? data.userId.toString() + data.friendId.toString()
          : data.friendId.toString() + data.userId.toString();
      if (MetoFriend || FriendtoMe) {
        this.server
          .to(data.userId.toString())
          .emit('addFriend', { code: RCode.FAIL, msg: '已与该用户成为好友！' });
        return;
      }
      await this.FriendRepository.save(data);
      const friendData = {
        friendId: data.userId,
        userId: data.friendId,
      };
      this.FriendRepository.save(friendData);
      client.join(roomId);
      this.server.to(data.userId.toString()).emit('addFriend', {
        code: RCode.OK,
        msg: `添加好友${Friendexist.username}成功`,
      });
      this.server.to(data.friendId.toString()).emit('addFriend', {
        code: RCode.OK,
        msg: `添加好友${Friendexist.username}成功`,
      });
    } else {
      this.server
        .to(data.userId.toString())
        .emit('addFriend', { code: RCode.ERROR, msg: '用户信息错误！' });
    }
  }
  @SubscribeMessage('joinChat')
  async joinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: FriendMessage,
  ) {
    console.log('joinChat', data);
    if (data.friendId && data.userId) {
      const relation = await this.FriendRepository.findOne({
        where: { userId: data.userId, friendId: data.friendId },
      });
      const roomId =
        data.userId > data.friendId
          ? data.userId.toString() + data.friendId.toString()
          : data.friendId.toString() + data.userId.toString();
      client.join(roomId);
      this.server.to(data.userId.toString()).emit('joinChat', {
        code: RCode.OK,
        msg: '进入私聊socket成功',
        data: relation,
      });
    }
  }
  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: FriendMessage,
  ) {
    const Userexist = await this.userRepository.findOne({
      where: { userId: data.userId },
    });
    const Friendexist = await this.FriendRepository.findOne({
      where: { friendId: data.friendId },
    });
    if (Userexist && Friendexist) {
      const roomId =
        data.userId > data.friendId
          ? data.userId.toString() + data.friendId.toString()
          : data.friendId.toString() + data.userId.toString();
      data.time = new Date().valueOf().valueOf();

      await this.FriendMessageRepository.save(data);
      console.log(data);
      this.server
        .to(roomId)
        .emit('sendMessage', { code: RCode.OK, msg: '发送成功', data });
    } else {
      this.server
        .to(data.userId.toString())
        .emit('addFriend', { code: RCode.ERROR, msg: '用户信息错误！' });
    }
  }
  @SubscribeMessage('getInfodata')
  async getInfodata(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: FriendMessage,
  ) {
    const Userexist = await this.userRepository.findOne({
      where: { userId: data.userId },
    });
    if (Userexist) {
      let friendArr: FriendDto[] = [];
      const friendMap: Friend[] = await this.FriendRepository.find({
        where: { userId: data.userId },
      });
      const friendPromise = friendMap.map(async (item) => {
        return await this.userRepository.findOne({
          where: { userId: item.friendId },
        });
      });
      const friendMessagePromise = friendMap.map(async (item) => {
        const messages = await this.datasource
          .getRepository(FriendMessage)
          .createQueryBuilder('friendMessage')
          .orderBy('friendMessage.time', 'ASC')
          .where(
            'friendMessage.userId = :userId And friendMessage.friendId  =:friendId',
            { userId: item.userId, friendId: item.friendId },
          )
          .orWhere(
            'friendMessage.userId = :friendId AND friendMessage.friendId = :userId',
            { userId: item.userId, friendId: item.friendId },
          )
          .take(30)
          .getMany();
        return messages;
      });
      const friends: any[] = await Promise.all(friendPromise);
      console.log(friends);
      const friendMessages = await Promise.all(friendMessagePromise);
      friends.map((item: any, index) => {
        item.messages = friendMessages[index];
      });
      friendArr = friends;
      this.server.to(data.userId.toString()).emit('getInfodata', {
        code: RCode.OK,
        msg: '获取聊天数据成功',
        data: {
          friendData: friendArr,
        },
      });
    }
  }
  @SubscribeMessage('removeFriend')
  async removeFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Friend,
  ) {
    console.log(data);
    const userExist = this.userRepository.findOne({
      where: { userId: data.userId },
    });
    const friendExist = this.userRepository.findOne({
      where: { userId: data.friendId },
    });
    const relationMetoFriend = await this.FriendRepository.findOne({
      where: { friendId: data.friendId, userId: data.userId },
    });
    const relationFriendtoMe = await this.FriendRepository.findOne({
      where: { userId: data.friendId, friendId: data.userId },
    });
    if (userExist && friendExist && relationFriendtoMe && relationMetoFriend) {
      await this.FriendRepository.remove(relationFriendtoMe);
      await this.FriendRepository.remove(relationMetoFriend);
      this.server.to(data.userId.toString()).emit('removeFriend', {
        code: RCode.OK,
        msg: '删除成功！',
        data: data,
      });
      return;
    }
    this.server.to(data.userId.toString()).emit('removeFriend', {
      code: RCode.FAIL,
      msg: '删除失败！',
      data: data,
    });
  }
}
