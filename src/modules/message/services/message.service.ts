import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';
import { Message } from '../../../entities';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly em: EntityManager,
  ) {}

  async create(data: CreateMessageDto): Promise<Message> {
    return this.messageRepository.generate(data);
  }

  findLastestMessages(id: ObjectId): Promise<Message[]> {
    return this.messageRepository.findLastestMessages(id);
  }
}
