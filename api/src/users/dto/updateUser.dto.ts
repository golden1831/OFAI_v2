import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: {
      name: 'Jhon',
      email: 'example@email.com',
      username: 'jhon',
      interests: ['Anime'],
    },
  })
  name?: string;
  email?: string;
  // profileImage: string;
  username?: string;
  interests: string[];
}
