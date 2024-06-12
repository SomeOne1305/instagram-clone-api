import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import {
  ChangePassDto,
  FileDto,
  SearchUserDto,
  UpdateUserDto,
} from 'src/dtoes/user.dto';
import { IReq } from 'src/types';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @HttpCode(200)
  async getAll() {
    return await this.usersService.getAllUsers();
  }

  @Get('user')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getUser(@Req() req: IReq, @Res() res: Response) {
    return this.usersService.getUserById(req.user.id, res);
  }

  @Get('username/:username')
  @HttpCode(200)
  async getByUsername(
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.getByUsername(username);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    res.json(user);
  }

  @Post('profile')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Image file', type: FileDto })
  @UseGuards(AuthGuard)
  async uploadProfileImage(
    @Req() req: IReq,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.uploadProfileImg(req.user.id, file);
  }

  @Post('search')
  @HttpCode(200)
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  async searchUser(@Query() searchDto: SearchUserDto) {
    return await this.usersService.searchUsers(searchDto);
  }

  @Delete('profile/:fileId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async deleteProfileImg(@Req() req: IReq, @Param('fileId') fileId: string) {
    return await this.usersService.deleteProfileImg(req.user.id, fileId);
  }

  @Put('update-me')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @ApiBody({ required: true, type: UpdateUserDto })
  @UsePipes(new ValidationPipe())
  async updateUser(@Req() req: IReq, @Body() dto: UpdateUserDto) {
    return await this.usersService.updateUser(req.user.id, dto);
  }

  @Put('change-pass')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @ApiBody({ type: ChangePassDto })
  @UsePipes(new ValidationPipe())
  async changeUserPass(@Req() req: IReq, @Body() dto: ChangePassDto) {
    return await this.usersService.changePassword(req.user.id, dto);
  }

  @Delete('delete-me')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async deleteAccount(@Req() req: IReq) {
    await this.usersService.deleteUserById(req.user.id);
    return {
      message: 'Account is deleted successfully',
    };
  }

  @Delete('delete-user/:userId')
  @HttpCode(200)
  async deleteUser(@Param('userId') id: string) {
    await this.usersService.deleteUserById(id);
    return {
      message: 'User is deleted successfully',
    };
  }
}
