import { ObjectId } from '@mikro-orm/mongodb';
import { IsNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  userIds: ObjectId[];
}
