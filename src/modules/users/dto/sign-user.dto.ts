import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUserDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
