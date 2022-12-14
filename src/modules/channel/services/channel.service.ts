import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../../message/repositories/message.repository';
import { Channel } from '../../../entities';
import { CreateChannelDto } from '../dtos/create-channel.dto';
import { ChannelRepository } from '../repositories/channel.repository';
import { SeenRepository } from 'src/modules/message/repositories';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly messageRepository: MessageRepository,
    private readonly em: EntityManager,
    private readonly seenRepository: SeenRepository,
  ) {}

  async create({ userIds }: CreateChannelDto): Promise<Channel> {
    const existingChannel = await this.channelRepository.findOne(
      {
        $and: [{ users: userIds[0] }, { users: userIds[1] }],
      },
      { populate: ['users'] },
    );
    if (existingChannel) return existingChannel;
    return this.channelRepository.generate(userIds);
  }

  async findOneById(id: ObjectId): Promise<Channel> {
    return this.channelRepository.findOne(id, {
      populate: ['users'],
    });
  }

  findMessages(id: ObjectId): Promise<Channel> {
    return this.channelRepository.getMessages(id);
  }
}
