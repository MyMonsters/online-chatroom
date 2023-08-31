//带有单个路由的基本控制器示例。
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('find')
  getHello(): string {
    return this.appService.getHello();
  }
}
