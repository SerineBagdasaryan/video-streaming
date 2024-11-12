import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { IUserQuery, PaginationQueryDTO } from 'src/common/dto';
export class MediaRecordingDTO extends PaginationQueryDTO implements IUserQuery {
    @ApiProperty({
        type: Number,
        description: 'The unique identifier for the user',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    userId?: number;
}

