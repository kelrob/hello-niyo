import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PayloadResponse {
  @Expose()
  email: string;

  @Expose()
  id: number;

  @Expose()
  iat: number;

  @Expose()
  exp: number;
}
