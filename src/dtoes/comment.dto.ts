import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

// comment.dto.ts
export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}

export class UpdateCommentDto {
  text?: string;
}
