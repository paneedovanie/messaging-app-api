import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { MessageRepository } from '../modules/message/repositories/message.repository';
import { Channel } from '.';
import { User } from './user.entity';

@Entity({ tableName: 'message', customRepository: () => MessageRepository })
export class Message {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Channel)
  channel!: Channel;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  content!: string;
}
