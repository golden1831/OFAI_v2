import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { assistantDto } from './dto/room.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import type { Response } from 'express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiOperation({
    summary: 'user sends message to companion, companion responses',
  })
  @ApiResponse({
    status: 201,
    description: 'Get response from companion successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Get response from companion failed.',
  })
  @ApiBody({
    type: assistantDto,
    description: 'The expected shape of the request body.',
  })
  @UseGuards(AuthGuard)
  @Post('send-message')
  async sendMessage(@Req() request, @Res() response) {
    try {
      const user = request.user;
      const data = request.body;

      const companionresponse = await this.roomsService.sendMessage(
        user,
        data.companionid,
        data.message,
        data.mode.toLowerCase(),
      );

      return response.status(201).send(companionresponse);
    } catch (error) {
      console.log(error);
      return response.status(403).send(error);
    }
  }

  @ApiOperation({
    summary: 'user sends message to companion, companion responses',
  })
  @ApiResponse({
    status: 201,
    description: 'Get response from companion successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Get response from companion failed.',
  })
  @Post('sign-out')
  async getMessageWhenSignOut(@Req() request, @Res() response) {
    try {
      const data = request.body;

      const companionresponse = await this.roomsService.getMessageWhenSignOut(
        data.companionid,
      );

      return response.status(201).send(companionresponse);
    } catch (error) {
      console.log(error);
      return response.status(403).send(error);
    }
  }

  @Get('messages')
  @ApiOperation({
    summary: 'Get all chat history between a user and a companion paginated',
  })
  @ApiQuery({ name: 'userid', type: String, description: 'The ID of the user' })
  @ApiQuery({
    name: 'companionid',
    type: String,
    description: 'The ID of the companion',
  })
  @ApiQuery({ name: 'page', type: Number, description: 'The page number' })
  @ApiQuery({
    name: 'length',
    type: Number,
    description: 'The number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Get chat history successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Get chat history failed.',
  })
  @UseGuards(AuthGuard)
  async getMessages(
    @Query('companionid') companionid: string,
    @Req() request,
    // @Query('page') page: number,
    // @Query('length') length: number,
    @Res() response,
  ) {
    try {
      const user = request.user;

      const data = await this.roomsService.getMessages(user, companionid);

      return response.status(201).send(data);
    } catch (error) {
      console.log(error);
      return response.status(403).send(error);
    }
  }

  // get companions that a given user has a chat history with
  @Get('me')
  @ApiOperation({ summary: 'Get all companions that user has a chat with' })
  @ApiResponse({
    status: 200,
    description: 'Get companions that user has a chat with successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Get companions that user has a chat with failed.',
  })
  @UseGuards(AuthGuard)
  async getMyRooms(@Req() req) {
    return this.roomsService.getMyRooms(req.user);
  }

  // streaming locked pics
  @Get('messages/:messageId/pic')
  async streamMessagePic(
    @Param('messageId') messageId: string,
    @Res() res: Response,
  ) {
    const streamableFile = await this.roomsService.streamMessagePic(messageId);
    if (streamableFile) {
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'inline; filename=blurred-image.jpg',
      });

      return streamableFile.getStream().pipe(res);
    }

    res.status(404).json({ message: 'Image not found' });
  }

  @Post('messages/:messageId/unlock/pic')
  @UseGuards(AuthGuard)
  async unlockPic(@Req() req, @Param('messageId') messageId: string) {
    const user = req.user;

    const message = await this.roomsService.unlockPic(user, messageId);
    if (!message) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return message;
  }

  // streaming locked videos
  @Get('messages/:messageId/video')
  async streamMessageVideo(
    @Param('messageId') messageId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const range = (req.headers as any).range;
    console.log('range ===>', messageId, range);
    if (!range) {
      res.status(416).send('Range header required');
      return;
    }

    const streamableVideo = await this.roomsService.streamMessageVideo(
      messageId,
      range,
    );
    if (streamableVideo) {
      const { proc, headers } = streamableVideo;
      // res.set({
      //   'Content-Type': 'video/mp4',
      //   'Content-Disposition': 'attachment; filename=blurred-video.mp4',
      // });
      // res.writeHead(206, headers);
      res.set(headers);

      return proc.pipe(res, { end: true });
    }

    res.status(404).json({ message: 'video not found' });
  }

  @Post('messages/:messageId/unlock/video')
  @UseGuards(AuthGuard)
  async unlockVideo(@Req() req, @Param('messageId') messageId: string) {
    const user = req.user;

    const message = await this.roomsService.unlockVideo(user, messageId);
    if (!message) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return message;
  }

  @Delete(':roomId')
  @UseGuards(AuthGuard)
  async deleteRoom(@Req() request, @Param('roomId') roomId: string) {
    const user = request.user;

    return await this.roomsService.deleteRoom(user, roomId);
  }

  @Post(':roomId/refresh')
  @UseGuards(AuthGuard)
  async refreshRoom(@Req() request, @Param('roomId') roomId: string) {
    const user = request.user;

    return await this.roomsService.refreshRoom(user, roomId);
  }

  // @Post('test')
  // async test(@Req() request) {
  //   const body = request.body;
  //   return await this.roomsService.generateCompanionPicture(
  //     body.companionId,
  //     body.message,
  //     'lingerie',
  //   );
  //   // return await this.roomsService.generateCompanionPicture(companionId);
  // }
}
