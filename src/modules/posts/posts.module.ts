import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { StorageService } from '../storage/storage.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, StorageService],
  imports: [TypeOrmModule.forFeature([Post, User])],
})
export class PostsModule {}
