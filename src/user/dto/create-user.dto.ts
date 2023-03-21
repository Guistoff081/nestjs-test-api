import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsString()
  hash: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsString()
  email: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'User profile pic',
  })
  @IsNotEmpty()
  avatar: any;
}
