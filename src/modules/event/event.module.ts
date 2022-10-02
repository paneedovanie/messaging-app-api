import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Channel, Message, User } from '../../entities';
import { ChannelService } from '../channel/services/channel.service';
import { MessageService } from '../message/services/message.service';
import { UserService } from '../user/services/user.service';
import { EventGateway } from './gateways/event.gateway';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Channel, Message, User] })],
  controllers: [],
  providers: [
    EventGateway,
    ChannelService,
    MessageService,
    UserService,
    JwtService,
  ],
})
export class EventModule {}