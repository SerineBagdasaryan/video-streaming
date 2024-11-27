import { MediaTypes } from '../enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ICreateMediaStream } from '../interfaces';
import { Organization } from '../../database/entities';
export class CreateMediaStreamDTO implements ICreateMediaStream {
  @ApiProperty()
  @IsNumber()
  userId: number;
  type: MediaTypes;
  filePath: string;
  organization: Organization;
}
