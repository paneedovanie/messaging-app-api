import { IsString, IsNotEmpty } from 'class-validator';

export class PushTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
