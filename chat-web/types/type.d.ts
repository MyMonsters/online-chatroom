import { Socket } from 'socket.io-client';
interface User {
  userId?: number;
  nickname: string;
  username?: string;
  password: string;
  desc: string;
  avatar: string;
  status: string;
  createtime?: Date;
}

interface NuxtApp {
  $socket: Socket;
}
interface Friend {
  _id: number;
  userId: number;
  friendId: number;
}
interface FriendDataType {
  userId: number;
  nickname: string;
  username: string;
  password: string;
  avatar: string;
  status: string;
  createTime: Date;
  desc: string;
  messages: Array<Message>;
}
interface Message {
  userId: number;
  friendId: number;
  content: string;
  width?: number;
  height?: number;
  time: number;
}
