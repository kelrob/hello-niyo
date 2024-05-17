import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponse } from './signup.response';

@Exclude()
export class LoginResponse {
  @Expose()
  message: string;

  @Expose()
  @Type(() => UserResponse)
  data: UserResponse;

  @Expose()
  accessToken: string;
}
