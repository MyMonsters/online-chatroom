interface FriendDto {
  userId: string;
  username: string;
  avatar: string;
  messages?: FriendMessageDto[];
  createTime: number;
}

// 好友消息
interface FriendMessageDto {
  userId: number;
  friendId: number;
  content: string;
  width?: number;
  height?: number;
  time: BigInt;
}
