import { Injectable } from '@nestjs/common';
import Expo from 'expo-server-sdk';
import { InjectExpo } from 'nestjs-expo-sdk';

const tokenMapper = new Map<string, string>();

@Injectable()
export class NotificationService {
  constructor(@InjectExpo() private expo: any) {}

  set(userId: string, token: string) {
    tokenMapper.set(userId, token);
  }

  get(userId: string) {
    return tokenMapper.get(userId);
  }

  async sendPush(
    userIds: string[],
    message: {
      title: string;
      body: string;
      data?: any;
    },
  ): Promise<any> {
    const messages = [];
    for (const userId of userIds) {
      const pushToken = tokenMapper.get(userId);
      if (!pushToken) continue;
      // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      // Construct a message
      messages.push({
        to: pushToken,
        sound: 'default',
        ...message,
      });
    }

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(
          messages,
        );
        // console.log(ticketChunk);
        // console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation
      } catch (error) {
        console.error(error);
      }
    }
  }
}
