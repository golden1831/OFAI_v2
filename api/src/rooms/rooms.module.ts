import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { MongoService } from 'src/mongo/mongo.service';
import { CompanionsService } from 'src/companions/companions.service';
import { S3Service } from 'src/s3/s3.service';
import { PromptchanService } from 'src/promptchan/promptchan.service';

@Module({
  controllers: [RoomsController],
  providers: [
    RoomsService,
    MongoService,
    CompanionsService,
    S3Service,
    PromptchanService,
  ],
})
export class RoomsModule {}
