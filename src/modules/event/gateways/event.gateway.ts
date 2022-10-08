import { ObjectId } from '@mikro-orm/mongodb';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageService } from '../../message/services/message.service';
import { Channel, Message, User } from '../../../entities';
import { ChannelService } from '../../../modules/channel/services/channel.service';
import { SocketEvent } from '../../../types';
import { CreateMessageDto } from 'src/modules/message/dtos/create-message.dto';
import { Server } from 'https';
import { Logger } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { NotificationService } from 'src/modules/notification/services/notification.service';

@WebSocketGateway({ cors: true })
export class EventGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(EventGateway.name);
  private clients = new Map();
  private userId;

  constructor(
    private readonly messageService: MessageService,
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  afterInit() {
    this.logger.log('Websocket Server Started');
  }

  handleDisconnect(client) {
    const { userId } = client.handshake.query;
    this.clients.delete(userId);
    this.userService.setOnline(userId, false);
    // console.log(`Client disconnected: ${userId}`);
  }

  handleConnection(client) {
    const { userId } = client.handshake.query;
    this.userId = userId;
    this.clients.set(userId, client);
    this.userService.setOnline(userId, true);
    // console.log(`Client connected: ${userId}`);
    // console.log(this.clients.size);
  }

  @SubscribeMessage(SocketEvent.GetLatestMessages)
  async findLastestMessages(@MessageBody() id: ObjectId): Promise<Message[]> {
    return this.messageService.findLastestMessages(id);
  }

  @SubscribeMessage(SocketEvent.GetChannelMessages)
  getChannelMessages(@MessageBody() id: ObjectId): Promise<Channel> {
    return this.channelService.findMessages(id);
  }

  @SubscribeMessage(SocketEvent.SubmitMessage)
  async submitMessage(@MessageBody() data: CreateMessageDto): Promise<Message> {
    const message = await this.messageService.create(data);
    const { users } = await this.channelService.findOneById(
      new ObjectId(data.channel.toString()),
    );
    Array.from(users).forEach(({ id }) => {
      const socket = this.clients.get(id);
      socket?.emit(SocketEvent.ChannelUpdated, { channelId: data.channel });
    });
    (async () => {
      const filteredUsers = Array.from(users).filter(
        ({ id }) => id !== message.user._id.toString(),
      );
      this.notificationService.sendPush(
        filteredUsers.map(({ id }) => id),
        {
          title: filteredUsers[0].name,
          body: message.content,
          data: {
            screen: 'Channel',
            channelId: data.channel.toString(),
            title: filteredUsers[0].name,
          },
        },
      );
    })();
    return message;
  }

  @SubscribeMessage(SocketEvent.SearchUser)
  async searchUser(@MessageBody() username: string): Promise<User> {
    return this.userService.findByUsername(username);
  }

  @SubscribeMessage(SocketEvent.CreateChannel)
  async createChannel(@MessageBody() userIds: ObjectId[]): Promise<Channel> {
    return this.channelService.create({ userIds });
  }
}
