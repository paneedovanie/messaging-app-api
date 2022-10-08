import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';
import { Message, Seen } from '../../../entities';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { SeenRepository } from '../repositories';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly em: EntityManager,
    private readonly seenRepository: SeenRepository,
  ) {}

  async create(data: CreateMessageDto): Promise<Message> {
    return this.messageRepository.generate(data);
  }

  async findLatestMessages(
    channelId: ObjectId,
    userId: ObjectId,
  ): Promise<Message[]> {
    return this.messageRepository.findLatestMessages(channelId, userId);
  }

  async messageSeen(
    channelId: ObjectId,
    messageId: ObjectId,
    userId: ObjectId,
  ): Promise<Seen> {
    const seen =
      (await this.seenRepository.findOne({
        channel: channelId,
        user: userId,
      })) ||
      this.seenRepository.create({
        channel: channelId,
        message: messageId,
        user: userId,
      });
    seen.message = await this.messageRepository.findOne(messageId);
    await this.em.persistAndFlush(seen);
    return seen;
  }
}
