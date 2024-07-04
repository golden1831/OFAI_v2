import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { IUser, IUserGallery } from 'src/types/user.types';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IPagination } from 'src/types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getUser(@Req() req): Promise<IUser> {
    const user = req.user;

    // check plan
    return user;
  }

  @UseGuards(AuthGuard)
  @Put('me')
  @UseInterceptors(FileInterceptor('image'))
  async updateUser(
    @Req() req,
    @Body() data: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ): Promise<IUser> {
    return await this.usersService.update(req.user, data, image);
  }

  @UseGuards(AuthGuard)
  @Get('my-gallery')
  async getMyGallery(@Req() req): Promise<IUserGallery[]> {
    return await this.usersService.getMyGallery(req.user);
  }

  @UseGuards(AuthGuard)
  @Post('checkin')
  async dailyCheckin(@Req() req): Promise<IUser> {
    return await this.usersService.dailyCheckin(req.user);
  }

  @Get('top-three')
  async topThreeUsers(): Promise<IUser[]> {
    return this.usersService.topThreeUsers();
  }

  @Get('leaderboard')
  async leaderBoard(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<IPagination<IUser>> {
    return await this.usersService.leaderBoard(Number(page), Number(limit));
  }

  @Get(':username')
  async getUserByUsernameOrWallet(
    @Param('username') username: string,
  ): Promise<IUser> {
    const user = this.usersService.getUserByUsernameOrWallet(username);
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return user;
  }
}
