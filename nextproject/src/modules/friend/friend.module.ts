import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './friend.entity';
import { FriendMessage } from './friendMessage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, FriendMessage])],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule {}
