import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Channel, User } from '../../../entities';

export class CreateMessageDto {
  @IsNotEmpty()
  @Type(() => Channel)
  channel!: Channel;

  @IsNotEmpty()
  @Type(() => User)
  user!: User;

  @IsNotEmpty()
  @IsString()
  content!: string;
}
