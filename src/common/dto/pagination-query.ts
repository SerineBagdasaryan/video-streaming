import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { IPaginationQuery } from '../models';


export class PaginationQueryDTO implements IPaginationQuery {
  @ApiProperty({
    type: Number,
    default: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  take?: number;

  @ApiProperty({
    type: Number,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  skip?: number;
}
