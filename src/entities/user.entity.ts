import {
  Collection,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { UserRepository } from '../modules/user/repositories/user.repository';
import { Channel } from './channel.entity';
import { Online } from './online.entity';

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

  @Property()
  color!: string;

  @ManyToMany(() => Channel, (channel) => channel.users)
  channels = new Collection<Channel>(this);

  @OneToOne(() => Online, (online) => online.user, { owner: true })
  online!: Online;
}
