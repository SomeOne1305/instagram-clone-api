import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlreadyDone } from '../../common/exceptions/AlreadyDone';
import { Like } from '../../entities/like.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async likePost(userId: string, postId: string): Promise<void> {
    const likedUser = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (likedUser) throw new AlreadyDone();
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    const like = this.likesRepository.create({ user, post });
    await this.likesRepository.save(like);
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    await this.likesRepository.delete({
      user: { id: userId },
      post: { id: postId },
    });
  }

  async getAllPostLikes(postId: string) {
    try {
      return await this.likesRepository.find({
        where: { post: { id: postId } },
        relations: ['user'],
      });
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
