import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../../entities/like.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
  imports: [TypeOrmModule.forFeature([User, Post, Like])],
})
export class LikesModule {}
