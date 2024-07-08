import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/Auth.guard';
import { CreatePostDto, GetPosts } from '../../dtoes/post.dto';
import { IReq } from '../../types';
import { multerOptions } from '../../utils/filterFiles';
import { PostsService } from './posts.service';
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('all')
  @HttpCode(200)
  @ApiQuery({ type: GetPosts })
  async getPosts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<any> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber < 1 ||
        limitNumber < 1
      ) {
        throw new BadRequestException('Invalid pagination parameters');
      }

      return await this.postsService.getAllPosts(pageNumber, limitNumber);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Get('user/:userId')
  async getUserPosts(@Param('userId') userId: string) {
    return await this.postsService.getUserPosts(userId);
  }

  @Get('post/:postId')
  @HttpCode(200)
  async getPostById(@Param('postId') postId: string) {
    const post = await this.postsService.getPostById(postId);
    if (post) {
      return post;
    }
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
  }

  @Post('create')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ required: true, type: CreatePostDto })
  @UseInterceptors(FileInterceptor('post_data', multerOptions))
  async createPost(
    @Req() req: IReq,
    @Body() body: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      body.post_data = file;

      return await this.postsService.createPost(req.user.id, body);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
