import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { ChannelRepository } from '../modules/channel/repositories/channel.repository';
import { User } from './user.entity';

@Entity({ tableName: 'channel', customRepository: () => ChannelRepository })
export class Channel {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToMany(() => User, (user) => user.channels, { owner: true })
  users = new Collection<User>(this);
}
