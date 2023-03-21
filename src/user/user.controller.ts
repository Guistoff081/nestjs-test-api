import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//import * as base64Img from 'base64-img';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const user = createUserDto;
    user.avatar = avatar.buffer;
    return await this.userService.create(user);
  }

  @Get('users')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('user/:id')
  async findOne(@Param('id') id: number) {
    return await this.userService.fetchFromReqRes(+id);
  }

  @Get('user/:id/avatar')
  async getAvatar(@Param('id') id: string) {
    return await this.userService.getAvatar(id);
  }

  @Patch('user/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('user/:id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  @Delete('user/:id/avatar')
  async deleteAvatar(@Param('id') id: string) {
    return await this.userService.removeAvatar(id);
  }
}
