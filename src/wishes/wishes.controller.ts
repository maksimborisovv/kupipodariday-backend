import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user.id, createWishDto);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOneById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.wishesService.remove(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copy(id, req.user.id);
  }
}
