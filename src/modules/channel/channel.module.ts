import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Channel, Message, Seen } from '../../entities';
import { ChannelController } from './controllers/channel.controller';
import { ChannelService } from './services/channel.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Channel, Message, Seen] })],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
