import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanionsModule } from './companions/companions.module';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './mongo/mongo.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { S3Service } from './s3/s3.service';
import { PromptchanService } from './promptchan/promptchan.service';
import { CivitaiService } from './civitai/civitai.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongoModule,
    CompanionsModule,
    UsersModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service, PromptchanService, CivitaiService],
})
export class AppModule {}
