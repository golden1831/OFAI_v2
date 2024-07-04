import { Injectable } from '@nestjs/common';

import { Collection, ObjectId, WithoutId } from 'mongodb';
import { MongoService } from 'src/mongo/mongo.service';
import { ICompanion } from 'src/types/companion.types';

@Injectable()
export class CompanionsService {
  private collection: Collection<WithoutId<ICompanion>>;

  constructor(private mongoService: MongoService) {
    this.collection = mongoService.db.collection('companions');
  }

  async getCompanions() {
    return await this.collection
      .aggregate([
        { $match: { deleted: { $ne: true } } },
        {
          $lookup: {
            from: 'companionPics',
            localField: 'imageId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  url: 1,
                },
              },
            ],
            as: 'image',
          },
        },
        {
          $unwind: {
            path: '$image',
          },
        },
      ])
      .toArray();
  }

  // get companions by id , only one
  async getCompanionsById(id: string): Promise<ICompanion | undefined> {
    const companions = await this.collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            deleted: { $ne: true },
          },
        },
        {
          $lookup: {
            from: 'companionPics',
            localField: 'imageId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  url: 1,
                },
              },
            ],
            as: 'image',
          },
        },
        {
          $unwind: {
            path: '$image',
          },
        },
      ])
      .toArray();

    return companions[0] as ICompanion;
  }

  // get companions by username , only one
  async getCompanionsByUsername(username: string) {
    const companions = await this.collection
      .aggregate([
        {
          $match: {
            username,
            deleted: { $ne: true },
          },
        },
        {
          $lookup: {
            from: 'companionPics',
            localField: 'imageId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  url: 1,
                },
              },
            ],
            as: 'image',
          },
        },
        {
          $unwind: {
            path: '$image',
          },
        },
      ])
      .toArray();

    return companions[0];
  }
}
