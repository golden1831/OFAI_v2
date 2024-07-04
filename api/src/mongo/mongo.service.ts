import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit {
  private client: MongoClient;
  public db: Db;

  constructor() {
    this.client = new MongoClient(process.env.MONGO_URI as string);
    this.db = this.client.db(process.env.MONGO_DB_NAME as string);
  }

  async onModuleInit() {
    await this.client.connect();
  }
}
