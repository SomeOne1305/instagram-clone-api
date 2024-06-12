import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageKitModule } from '@platohq/nestjs-imagekit';
import storageConfig from 'src/configs/storage.config';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Post, Comment]),
    ImageKitModule.registerAsync({
      useFactory: () => storageConfig(),
    }),
  ],
})
export class UsersModule {}
