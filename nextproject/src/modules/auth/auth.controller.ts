import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}
  //   @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return this.AuthService.login(req.body);
  }
  @Post('/register')
  async register(@Request() req) {
    return this.AuthService.register(req.body);
  }
}
