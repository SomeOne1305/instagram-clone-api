import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../../dtoes/comment.dto';
import { Comment } from '../../entities/comment.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createComment(postId: string, userId: string, dto: CreateCommentDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const post = await this.postsRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }

      const comment = this.commentRepository.create({
        text: dto.text,
        user: user,
        post: post,
      });
      return await this.commentRepository.save(comment, { transaction: true });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPostComments(postId: string): Promise<Comment[]> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
    try {
      return await this.commentRepository.find({
        where: { post: { id: postId } },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching comments for post with ID ${postId}: ${error.message}`,
      );
    }
  }

  async deleteComment(commentId: string) {
    try {
      const result = await this.commentRepository.delete({ id: commentId });
      if (result.affected === 0) {
        throw new NotFoundException(`Comment with ID ${commentId} not found`);
      }
      return { message: 'Deleted' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
