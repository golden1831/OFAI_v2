import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CompanionsService } from './companions.service';

@Controller('companions')
export class CompanionsController {
  constructor(private companionService: CompanionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get companions as paginated list' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  async getCompanions() {
    const companions = await this.companionService.getCompanions();
    return companions;
  }

  // get companions by id
  @Get(':id')
  @ApiOperation({ summary: 'Get companions by id ' })
  async getCompanionsById(@Param('id') id: string) {
    const companion = await this.companionService.getCompanionsById(id);
    if (!companion) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return companion;
  }

  // get companions by username , only one
  @Get('username/:username')
  @ApiOperation({ summary: 'Get companions by username ' })
  async getCompanionsByUsername(@Param('username') username: string) {
    const companion =
      await this.companionService.getCompanionsByUsername(username);
    if (!companion) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return companion;
  }
}
