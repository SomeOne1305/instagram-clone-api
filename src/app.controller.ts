import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import path from 'path';

@ApiTags('')
@Controller('')
export class AppController {
  constructor() {}

  @Get('api')
  async getDocs(@Res() res: Response) {
    return res.sendFile(
      path.join(__dirname, '../node_modules/swagger-ui-dist/index.html'),
    );
  }
}
