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
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { Like } from 'src/entities/like.entity';
import { IReq } from 'src/types';
import { LikesService } from './likes.service';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  async likePost(
    @Param('postId') postId: string,
    @Req() req: IReq,
  ): Promise<void> {
    await this.likesService.likePost(req.user.id, postId);
  }

  @Get(':postId')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  async getLikes(@Param('postId') postId: string): Promise<Like[] | any> {
    return await this.likesService.getAllPostLikes(postId);
  }

  @Delete(':postId')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  async unlikePost(
    @Param('postId') postId: string,
    @Req() req: IReq,
  ): Promise<void> {
    await this.likesService.unlikePost(req.user.id, postId);
  }
}
