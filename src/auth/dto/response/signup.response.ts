import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserResponse {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

@Exclude()
export class SignupResponse {
  @Expose()
  message: string;

  @Expose()
  @Type(() => UserResponse)
  data: UserResponse;
}
