import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Readable } from 'stream';
// post.dto.ts

export class GetPosts {
  page: number;
  limit: number;
}

export class FileDto {
  fieldname: string;
  originalname: string;

  encoding: string;
  mimetype: string;
  size: number;

  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export class CreatePostDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @Type(() => FileDto)
  post_data: FileDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  post_caption: string;
}

export class UpdatePostDto {
  postUrl?: string;
  post_caption?: string;
}
