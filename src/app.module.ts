import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import {TypeOrmModule} from "@nestjs/typeorm"
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Review } from './reviews/review.entity';
import { User } from './users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ProductsModule , 
    UsersModule , 
    ReviewsModule,
    UploadModule,
    MailModule,
    TypeOrmModule.forRootAsync({
     inject: [ConfigService],
     useFactory: (config: ConfigService) => {
      return {
        type: "postgres",
        database: config.get<string>("DB_DATABASE"),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        port: config.get<number>("DB_PORT"),
        host: "localhost",
        synchronize: process.env.NODE_ENV !== "production", // only in development
        entities: [Product , Review , User]
      }
     }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})

export class AppModule {}
