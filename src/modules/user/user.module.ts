import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, Online } from '../../entities';
import { NotificationModule } from '../notification/notification.module';
import { NotificationService } from '../notification/services/notification.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User, Online] }),
    NotificationModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, NotificationService],
})
export class UserModule {}
