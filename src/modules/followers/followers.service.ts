import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async getFollowers(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followers'],
    });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    return user.followers;
  }

  async getFollowings(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followings'],
    });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    return user.followings;
  }

  async followUser(userId: string, followId: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followings'],
    });
    const followUser = await this.usersRepository.findOne({
      where: { id: followId },
    });

    if (!user.followings) {
      user.followings = [];
    }

    user.followings.push(followUser);
    await this.usersRepository.save(user);
  }

  async unfollowUser(userId: string, followId: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followings'],
    });
    user.followings = user.followings.filter(
      (following) => following.id !== followId,
    );
    await this.usersRepository.save(user);
  }
}
