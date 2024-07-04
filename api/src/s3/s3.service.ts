import { Storage } from '@google-cloud/storage';
import { Injectable, StreamableFile } from '@nestjs/common';
import { createHash } from 'crypto';
import * as sharp from 'sharp';
import { PassThrough, Readable } from 'stream';
import * as ffmpeg from 'fluent-ffmpeg';

interface IS3Upload {
  folder: string;
  file: Express.Multer.File;
  fileName?: string;
  bucketName?: string;
}

interface IBase64S3Upload {
  folder: string;
  base64: string;
  fileName: string;
  bucketName?: string;
  fileExt?: string;
  contentType?: string;
}

@Injectable()
export class S3Service {
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
  }

  async uploadFile({
    folder,
    file,
    fileName,
    bucketName = process.env.GCLOUD_STORAGE_BUCKET,
  }: IS3Upload) {
    const bucket = this.storage.bucket(bucketName);
    const fileExt = file.originalname.split('.').pop();
    const hash = createHash('md5')
      .update(new Date().toISOString())
      .digest('hex');
    const key = `${folder}/${(fileName || file.originalname.replace(`.${fileExt}`, '')).toLowerCase()}_${hash}.${fileExt}`;

    await bucket.file(key).save(file.buffer, {
      contentType: file.mimetype,
    });

    return `https://storage.googleapis.com/${bucketName}/${key}`;
  }

  async uploadBase64Image({
    folder,
    fileName,
    base64,
    bucketName = process.env.GCLOUD_STORAGE_BUCKET,
    fileExt = 'jpg',
    contentType = 'image/jpeg',
  }: IBase64S3Upload) {
    const bucket = this.storage.bucket(bucketName);
    const hash = createHash('md5')
      .update(new Date().toISOString())
      .digest('hex');

    const key = `${folder}/${fileName}_${hash}.${fileExt}`;

    const buffer = Buffer.from(base64, 'base64');

    await bucket.file(key).save(buffer, {
      contentType,
    });

    return `https://storage.googleapis.com/${bucketName}/${key}`;
  }

  async fetchAndBlurImage(
    bucketName: string,
    key: string,
  ): Promise<StreamableFile | null> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(key);
    const fileExists = (await file.exists())[0];
    if (fileExists) {
      const fileStream = file.createReadStream();
      const passThroughStream = new PassThrough();

      fileStream
        .pipe(sharp().blur(40)) // Adjust the blur level as needed
        .pipe(passThroughStream);

      return new StreamableFile(passThroughStream);
    }

    return null;
  }

  async streamAnBlurVideo(
    bucketName: string,
    key: string,
    range: string,
  ): Promise<{ proc: Readable; headers: any }> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(key);

    const fileExists = (await file.exists())[0];
    if (fileExists) {
      const [fileMetadata] = await file.getMetadata();
      const videoSize = Number(fileMetadata.size);

      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;

      const headers = {
        // 'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        // 'Accept-Ranges': 'bytes',
        // 'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
        // 'Content-Disposition': 'attachment; filename=blurred-video.mp4',
      };
      console.log({ start, end, videoSize });
      const fileStream = file.createReadStream({ start: 0, end: CHUNK_SIZE });

      return new Promise((resolve, reject) => {
        const proc = ffmpeg(fileStream)
          .videoFilters('boxblur=100:1')
          // .addOutputOptions(
          //   '-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov',
          // )
          .outputOptions('-movflags frag_keyframe+empty_moov')
          .format('mp4')
          .on('start', () => {
            console.log('FFmpeg process started');
          })
          .on('end', () => {
            console.log('FFmpeg process finished');
          })
          .on('error', (err) => {
            console.error('Error processing video:', err);
            reject(err);
          });

        resolve({ proc, headers });
      });
    }

    return null;
  }
}
