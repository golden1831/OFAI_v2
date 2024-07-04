import { ApiProperty } from '@nestjs/swagger';

export class assistantDto {
  @ApiProperty({
    example: {
      companionid: '67ghghHHWASXxjkdj',
      message: 'done',
      mode: 'text',
    },
  })
  data: {
    companionid: Number;
    message: string;
    mode: string;
  };
}
