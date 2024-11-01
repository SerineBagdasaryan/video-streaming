import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDTO {
  @IsString()
  @ApiProperty({ default: 'wqrwetwet', type: String })
  accessToken: string;
}
