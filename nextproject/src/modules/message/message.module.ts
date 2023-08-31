import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from '../friend/friend.entity';
import { FriendMessage } from '../friend/friendMessage.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend, FriendMessage])],
  providers: [MessageGateway],
})
export class MessageModule {}
