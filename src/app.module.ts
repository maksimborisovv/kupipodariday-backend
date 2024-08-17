import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashModule } from './hash/hash.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD  '),
        database: configService.get('DB_NAME'),
        entities: [User, Wish, Wishlist, Offer],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    HashModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
