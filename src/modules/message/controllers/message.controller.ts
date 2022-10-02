import { Body, Controller, Get, Post } from '@nestjs/common';
import { Message } from '../../../entities';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { MessageService } from '../services/message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // @Post()
  // create(@Body() body: CreateMessageDto): Promise<Message> {
  //   return this.messageService.create(body);
  // }
}
