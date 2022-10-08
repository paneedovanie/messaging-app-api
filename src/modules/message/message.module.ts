import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Seen, Message } from '../../entities';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Message, Seen] })],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
