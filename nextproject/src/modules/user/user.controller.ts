import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { query } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('getUserInfo')
  getUserInfo(userId: number) {
    return this.userService.getUser(userId);
  }
  @Get('getUserByUsername')
  getUserByUsername(@Query() query: any) {
    return this.userService.getUserByUsername(query.username);
  }
  @Post('updateUser')
  updateUser(@Body() body: any) {
    return this.userService.updateUser(body);
  }

  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const url = `http://localhost:3000/static/${file.filename}`;
    console.log('upload', file);
    return this.userService.uploadAvatar(url, body.userId);
  }
}
