import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { Channel } from './channel.entity';

@Entity({ tableName: 'user', customRepository: () => UserRepository })
export class User {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt: Date;

  @Property()
  name!: string;

  @Property()
  username!: string;

  @Property()
  password!: string;

  @ManyToMany(() => Channel, (channel) => channel.users)
  channels = new Collection<Channel>(this);
}
