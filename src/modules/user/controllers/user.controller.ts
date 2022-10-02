import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { CurrentUser } from '../../../decorators/current-user.decorator';
import { User } from '../../../entities/user.entity';
import { UserAccessToken } from '../../../types/user.type';
import { LoginUserDto } from '../dtos/login-user.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
}
