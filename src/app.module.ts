import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
