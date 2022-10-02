import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import {
  ChannelModule,
  EventModule,
  MessageModule,
  UserModule,
} from './modules';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      dbName: configuration().database.name,
      type: 'mongo',
      clientUrl: configuration().database.url,
      allowGlobalContext: true,
    }),
    UserModule,
    PassportModule,
    ChannelModule,
    MessageModule,
    EventModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
