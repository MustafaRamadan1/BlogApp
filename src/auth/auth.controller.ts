import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ name: string; email: string; token: string }> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async login(@Body() loginDto: loginDto): Promise<{ token: string }> {
    return await this.authService.login(loginDto);
  }
}
