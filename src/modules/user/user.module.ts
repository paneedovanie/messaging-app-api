import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, Online } from '../../entities';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User, Online] })],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
