import { Module } from '@nestjs/common';
import { CompanionsService } from './companions.service';
import { CompanionsController } from './companions.controller';
import { MongoService } from 'src/mongo/mongo.service';

@Module({
  providers: [CompanionsService, MongoService],
  controllers: [CompanionsController],
  exports: [CompanionsService],
})
export class CompanionsModule {}
