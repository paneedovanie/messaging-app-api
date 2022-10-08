import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { MessageRepository } from '../modules/message/repositories/message.repository';
import { Channel, Seen } from '.';
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

  @OneToMany(() => Seen, (seen) => seen.message, {
    mappedBy: '_id',
  })
  seen!: Seen;
}
