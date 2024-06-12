import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './configs/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { FollowersModule } from './modules/followers/followers.module';
import { LikesModule } from './modules/likes/likes.module';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PostsModule,
    UsersModule,
    CommentsModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    ConfigModule.forRoot(),
    AuthModule,
    FollowersModule,
    LikesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
