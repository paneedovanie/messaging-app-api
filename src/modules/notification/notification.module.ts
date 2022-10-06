import { ExpoSdkModule } from 'nestjs-expo-sdk';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [
    ExpoSdkModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: (configService: ConfigService) => ({
        accessToken: configService.get('expo').accessToken,
      }),
      inject: [ConfigService, NotificationService],
    }),
  ],
})
export class NotificationModule {}
