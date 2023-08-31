import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      // 用于配置上传，这部分也可以写在路由上
      storage: diskStorage({
        // destination: join(__dirname, '../images'),
        destination: join('./public/images'),
        filename: (_, file, callback) => {
          console.log(file);
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
