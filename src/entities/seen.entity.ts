import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { SeenRepository } from '../modules/message/repositories';
import { User, Message, Channel } from './';

@Entity({ tableName: 'seen', customRepository: () => SeenRepository })
export class Seen {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Channel)
  channel!: Channel;

  @ManyToOne(() => Message)
  message!: Message;
}
