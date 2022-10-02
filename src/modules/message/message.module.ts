import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Message } from 'src/entities/message.entity';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Message] })],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
