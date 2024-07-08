// post.service.ts
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/dtoes/post.dto';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly storage: StorageService,
  ) {}
  async getAllPosts(
    page: number,
    limit: number,
  ): Promise<{ posts: Post[]; total: number }> {
    if (page < 1) {
      throw new BadRequestException('Page must be a positive integer');
    }
    const [posts, total] = await this.postRepository.findAndCount({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { posts: posts, total };
  }
  async getPostById(id: string): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id: id },
    });
  }
  async getUserPosts(userId: string) {
    try {
      const posts = await this.postRepository.find({
        where: { user: { id: userId } },
        relations: ['likes', 'comments'],
        order: {
          createdAt: 'DESC',
        },
      });
      return posts.map((post) => {
        const { likes, comments, ...others } = post;
        return {
          ...others,
          likes: likes.length,
          comments: comments.length,
        };
      });
    } catch (error) {}
  }
  async createPost(userId: string, dto: CreatePostDto): Promise<Post> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const res = await this.storage.upload({
      fileName: 'post_' + Math.random().toString(16).slice(2),
      file: dto.post_data.buffer,
      folder: 'posts',
    });

    try {
      const post = await this.postRepository.save({
        post_caption: dto.post_caption,
        post_data: {
          type: dto.post_data.mimetype.split('/')[0],
          fileId: res.fileId,
          url: res.url,
        },
        user: { id: userId },
      });
      return post;
    } catch (error) {
      await this.storage.deleteFile(res.fileId);
      throw new InternalServerErrorException(error);
    }
  }

  async deletePost(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post with this id not found');
    }
    try {
      await this.storage.deleteFile(post.post_data.fileId);
      await this.postRepository.delete({ id: id });
      return new HttpException('Deleted successfully !', 200);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
