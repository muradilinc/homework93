import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  @Post()
  async registerUser(@Body() registerUserDto: CreateUserDto) {
    try {
      const user = new this.userModel({
        email: registerUserDto.email,
        password: registerUserDto.password,
        displayName: registerUserDto.displayName,
      });

      user.generateToken();
      return await user.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(error);
      }

      throw error;
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async login(@Req() req: Request) {
    return { message: 'Correct', user: req.user };
  }

  @Delete('sessions')
  @UseGuards(TokenAuthGuard)
  async logout(@Req() req: Request) {
    const user = req.user as UserDocument;
    user.generateToken();
    await user.save();
    return { message: 'Success!', stage: 'Success', user };
  }
}
