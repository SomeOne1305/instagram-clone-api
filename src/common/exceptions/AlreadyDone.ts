import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyDone extends HttpException {
  constructor() {
    super('You have already liked it', HttpStatus.CONFLICT);
  }
}
