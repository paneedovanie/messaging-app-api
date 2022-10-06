import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { CurrentUser } from '../../../decorators/current-user.decorator';
import { User } from '../../../entities/user.entity';
import { UserAccessToken } from '../../../types/user.type';
import { ChangePasswordDto, PushTokenDto, UpdateUserDto } from '../dtos';
import { LoginUserDto } from '../dtos/login-user.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() currentUser) {
    if (!currentUser) throw new UnauthorizedException();
    return this.userService.getById(currentUser.id);
  }

  @Post('login')
  login(@Body() data: LoginUserDto): Promise<UserAccessToken> {
    return this.userService.login(data);
  }

  @Post('register')
  register(@Body() data: RegisterUserDto): Promise<UserAccessToken> {
    return this.userService.register(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  changePassword(
    @CurrentUser() currentUser: User,
    @Body() data: ChangePasswordDto,
  ): Promise<User> {
    if (!currentUser) throw new UnauthorizedException();
    return this.userService.changePassword(currentUser.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  update(
    @CurrentUser() currentUser: User,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    if (!currentUser) throw new UnauthorizedException();
    return this.userService.update(currentUser.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/push-token')
  pushToken(
    @CurrentUser() currentUser: User,
    @Body() data: PushTokenDto,
  ): void {
    if (!currentUser) throw new UnauthorizedException();
    return this.notificationService.set(currentUser.id, data.token);
  }
}
