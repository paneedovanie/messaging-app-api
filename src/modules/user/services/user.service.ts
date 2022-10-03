import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { UserRepository, OnlineRepository } from '../repositories';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UserAccessToken } from 'src/types/user.type';
import { generateColorFromText } from 'src/utils/main.util';
import { Online, User } from '../../../entities';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly onlineRepository: OnlineRepository,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find({});
  }

  getById(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async login({ username, password }: LoginUserDto): Promise<UserAccessToken> {
    const unauthorizedMessage = 'Invalid username and password combination';
    const user = await this.userRepository.findOne({ username });
    if (!user) throw new UnauthorizedException(unauthorizedMessage);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException(unauthorizedMessage);
    return this.generateToken(user);
  }

  async register(data: RegisterUserDto): Promise<UserAccessToken> {
    const isExisting = await this.userRepository.findOne({
      username: data.username,
    });
    if (isExisting) throw new ConflictException('username already in used');
    data.password = await this.hashPassword(data.password);
    const user = this.userRepository.create(data);
    user.color = generateColorFromText(user.name);
    await this.em.persistAndFlush(user);
    return this.generateToken(user);
  }

  hashPassword(password: string) {
    const passwordOptions = this.configService.get('password');
    return bcrypt.hash(password, passwordOptions.saltOrRounds);
  }

  generateToken(user): UserAccessToken {
    const tokenOptions = this.configService.get('token');
    const tokenPayload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(tokenPayload, tokenOptions);
    return {
      accessToken,
      user,
    };
  }

  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  async setOnline(userId: ObjectId, value: boolean): Promise<User> {
    const user = await this.userRepository.findOne(userId, {
      populate: ['online'],
    });
    user.online = this.onlineRepository.create({
      _id: user.online?._id,
      active: value,
    });
    await this.em.persistAndFlush(user);
    return user;
  }
}
