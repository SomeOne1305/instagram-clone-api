import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/Auth.guard';
import { IReq } from '../../types';
import { FollowersService } from './followers.service';

@ApiTags('Followers')
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Get('followers/:userId')
  async getUserFollowers(@Param('userId') userId: string) {
    return await this.followersService.getFollowers(userId);
  }

  @Get('followings/:userId')
  async getUserFollowings(@Param('userId') userId: string) {
    return await this.followersService.getFollowings(userId);
  }

  @Post(':followId')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  async followUser(
    @Param('followId') followId: string,
    @Req() req: IReq,
  ): Promise<void> {
    await this.followersService.followUser(req.user.id, followId);
  }

  @Delete(':followId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async unfollowUser(
    @Req() req: IReq,
    @Param('followId') followId: string,
  ): Promise<void> {
    await this.followersService.unfollowUser(req.user.id, followId);
  }
}
