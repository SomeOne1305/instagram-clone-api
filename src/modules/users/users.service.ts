// user.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Repository } from 'typeorm';
// DTO
import {
  ChangePassDto,
  SearchUserDto,
  UpdateUserDto,
} from 'src/dtoes/user.dto';

// Entities
import { User } from 'src/entities/user.entity';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly storage: StorageService,
  ) {}
  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUserById(id: string, res: Response) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      res.cookie('access_token', '', { maxAge: 0 });
      res.cookie('refresh_token', '', { maxAge: 0 });
      return res.status(404).json({ message: 'User is not found' });
    }
    return res.status(200).json(user);
  }
  async getByUsername(username: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['posts', 'followings', 'followers'],
    });
    if (!user)
      throw new NotFoundException(
        'User with username "' + username + '" is not found',
      );
    const { posts, followers, followings, ...others } = user;
    return {
      ...others,
      posts: posts.length,
      followers: followers.length,
      followings: followings.length,
    };
  }

  async uploadProfileImg(
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} is not found`);
    }
    if (user.profileImg.type === 'edited') {
      await this.storage.deleteFile(user.profileImg.fileId);
    }
    const res = await this.storage.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: 'users',
    });
    user.profileImg = {
      fileId: res.fileId,
      url: res.url,
      type: 'edited',
    };

    return await this.usersRepository.save(user);
  }

  async deleteProfileImg(id: string, fileId: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found`);
    }
    if (user.profileImg.type === 'default') {
      throw new BadRequestException(
        'Your request contains invalid fileId parameter.',
      );
    }
    await this.storage.deleteFile(fileId).catch((err) => {
      console.log(err);
    });
    user.profileImg = {
      fileId: '6645de4388c257da336f10ec',
      url: 'https://ik.storage.io/lhvoxkb7i/users/default-user_kHqfmeEDX',
      type: 'default',
    };
    return await this.usersRepository.save(user);
  }

  async searchUsers(searchDto: SearchUserDto): Promise<User[]> {
    const { query } = searchDto;
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (query) {
      queryBuilder
        .where('user.username ILIKE :query', { query: `%${query}%` })
        .orWhere('user.fullName ILIKE :query', { query: `%${query}%` });
    }

    return await queryBuilder.getMany();
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found`);
    }
    const updatedUser = Object.assign(user, dto);
    return await this.usersRepository.save(updatedUser);
  }

  async changePassword(userId: string, dto: ChangePassDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} is not found`);
    }

    const isCorrectPass = bcrypt.compareSync(dto.prevPassword, user.password);
    if (!isCorrectPass) throw new BadRequestException('Incorrect password !');

    const newHashedPass = bcrypt.hashSync(dto.newPassword);

    user.password = newHashedPass;
    return await this.usersRepository.save(user);
    // return {
    //   message: 'Password has been changed successfully !',
    // };
  }

  async deleteUserById(id: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['posts'],
      });
      if (user.posts?.length > 0) {
        user.posts.map(async (item) => {
          await this.storage.deleteFile(item.post_data.fileId);
        });
      }
      if (user.profileImg.type === 'edited') {
        await this.storage.deleteFile(user.profileImg.fileId);
      }
      return await this.usersRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
