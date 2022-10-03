import {
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { OnlineRepository } from '../modules/user/repositories/online.repository';
import { User } from '.';

@Entity({ tableName: 'online', customRepository: () => OnlineRepository })
export class Online {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToOne(() => User, (user) => user.online)
  user!: User;

  @Property({ default: false })
  active: boolean;
}
