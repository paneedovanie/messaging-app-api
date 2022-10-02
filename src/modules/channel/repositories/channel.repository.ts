import { EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { Channel } from '../../../entities';

export class ChannelRepository extends EntityRepository<Channel> {
  async generate(users: ObjectId[]): Promise<Channel> {
    const channel = this.create({ users });
    await this.em.persistAndFlush(channel);
    return this.findOne({ id: channel.id }, { populate: ['users'] });
  }
}
