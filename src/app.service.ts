import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  healthCheck(): { status: boolean; message: string } {
    return { message: "Hello Niyo. Let's change the world 😉😉", status: true };
  }
}
