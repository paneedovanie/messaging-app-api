import { ObjectId } from '@mikro-orm/mongodb';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Channel, Message } from '../../../entities';
import { CreateChannelDto } from '../dtos/create-channel.dto';
import { ChannelService } from '../services/channel.service';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // @Post()
  // create(@Body() body: CreateChannelDto): Promise<Channel> {
  //   return this.channelService.create(body);
  // }

  // @Get(':id')
  // getOne(@Param('id') id: ObjectId): Promise<Channel> {
  //   return this.channelService.findOneById(id);
  // }

  // @Get(':id/messages')
  // findByChannelId(@Param('id') id: ObjectId): Promise<Message[]> {
  //   return this.channelService.findMessages(id);
  // }
}
