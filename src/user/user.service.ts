import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async fetchFromReqRes(id: number): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(`https://reqres.in/api/users/${id}`).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  async getAvatar(id: string): Promise<any> {
    const user = await this.userModel.findById(id).exec();
    if (user) {
      const avatarBuffer = user.avatar.toString('base64');
      return avatarBuffer;
    }
    return null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .exec();
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async removeAvatar(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (user) {
      user.avatar = null;
      return user.save();
    }
    return null;
  }
}
