import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/Auth.guard';
import { CreateCommentDto } from '../../dtoes/comment.dto';
import { IReq } from '../../types';
import { CommentsService } from './comments.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsService.name);

  constructor(private readonly commentsService: CommentsService) {}

  @Post('write/:postId')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ApiBody({ required: true, type: CreateCommentDto })
  @UsePipes(new ValidationPipe())
  async writeComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: IReq,
  ) {
    this.logger.log(
      `Creating comment for post ${postId} by user ${req.user.id}`,
    );
    return await this.commentsService.createComment(postId, req.user.id, dto);
  }

  @Get(':postId')
  @HttpCode(200)
  async getComments(@Param('postId') postId: string) {
    return await this.commentsService.getPostComments(postId);
  }

  @Delete(':commentId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200 })
  async deleteComment(@Param('commentId') commendId: string) {
    return await this.commentsService.deleteComment(commendId);
  }
}
