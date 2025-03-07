import { SignUpDto } from './dto/signup.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ name: string; email: string; token: string }> {
    const { name, email, password } = signUpDto;

    const newUser = await this.userModel.create({
      name,
      email,
      password,
    });

    const token = this.jwtService.sign({ id: newUser._id });

    return { name: newUser.name, email: newUser.email, token };
  }

  async login(
    loginDto: loginDto,
  ): Promise<{ name: string; email: string; token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { name: user.name, email: user.email, token };
  }
}
