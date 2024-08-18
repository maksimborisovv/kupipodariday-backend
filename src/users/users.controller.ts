import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get('me/wishes')
  getUserWishes(@Req() req) {
    return this.usersService.findWishes(req.user.id);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  async getUserWishesByUsername(@Param('username') username: string) {
    const { id } = await this.usersService.findByUsername(username);

    return this.usersService.findWishes(id);
  }

  @Post('find')
  findUsers(@Body() query: string) {
    return this.usersService.findMany(query);
  }
}
