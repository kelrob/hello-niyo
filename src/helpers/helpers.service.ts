import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpersService {
  isObjectEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0 && typeof obj === 'object';
  }
}
