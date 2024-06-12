import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';

@Module({
  controllers: [FollowersController],
  providers: [FollowersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class FollowersModule {}
