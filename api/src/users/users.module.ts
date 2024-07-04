import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongoService } from 'src/mongo/mongo.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, MongoService, S3Service],
})
export class UsersModule {}
