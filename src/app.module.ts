import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import * as path from 'path';
import databaseConfig from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { CenterUsersModule } from './modules/center-users/center-users.module';
import { RolesModule } from './modules/roles/roles.module';
import { MenusModule } from './modules/menus/menus.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),

    // I18n
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),

    // Rate limiting (disabled for this version)
    // ThrottlerModule.forRoot([
    //   {
    //     name: 'default',
    //     ttl: 60000, // 60 seconds
    //     limit: 10, // 10 requests per minute
    //   },
    //   {
    //     name: 'auth',
    //     ttl: 60000, // 60 seconds
    //     limit: 5, // 5 auth requests per minute
    //   },
    // ]),

    // Feature modules
    AuthModule,
    CenterUsersModule,
    RolesModule,
    MenusModule,
  ],
  controllers: [],
  providers: [
    // Apply JWT guard globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Apply Roles guard globally
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Apply Throttler guard globally (disabled for this version)
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
