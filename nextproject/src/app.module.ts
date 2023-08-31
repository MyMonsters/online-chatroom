//应用程序的根模块。
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './modules/auth/auth.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FriendModule } from './modules/friend/friend.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'chat',
      charset: 'utf8mb4', // 设置chatset编码为utf8mb4
      autoLoadEntities: true,
      // entities: [],
      synchronize: true,
    }),
    JwtModule,
    UserModule,
    AuthModule,
    FriendModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
