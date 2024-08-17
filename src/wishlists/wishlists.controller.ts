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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Req() req,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(id, req.user.id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.wishlistsService.remove(id, req.user.id);
  }
}
