import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Channel, Message, Online, Seen, User } from '../../entities';
import { ChannelService } from '../channel/services/channel.service';
import { MessageService } from '../message/services/message.service';
import { NotificationService } from '../notification/services/notification.service';
import { UserService } from '../user/services/user.service';
import { EventGateway } from './gateways/event.gateway';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Channel, Message, User, Online, Seen],
    }),
  ],
  controllers: [],
  providers: [
    EventGateway,
    ChannelService,
    MessageService,
    UserService,
    JwtService,
    NotificationService,
  ],
})
export class EventModule {}
