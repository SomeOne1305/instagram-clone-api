import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entities/comment.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [TypeOrmModule.forFeature([Comment, Post, User])],
})
export class CommentsModule {}
