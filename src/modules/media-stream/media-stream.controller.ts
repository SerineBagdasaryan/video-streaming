import { Controller, Get, Query } from '@nestjs/common';
import { MediaStreamService } from './media-stream.service';
import { IMetaResponse } from 'src/common/interfaces';
import { MediaStream } from '../../database/entities'
import { MetaResponse } from 'src/common/helpers';
import { MediaRecordingDTO } from './dto';

@Controller('media-stream')
export class MediaStreamController {
    constructor(private readonly mediaStreamService: MediaStreamService) {
    }

    @Get()
    async findAll(
        @Query() query: MediaRecordingDTO,
    ): Promise<{ data: MediaStream[]; meta: IMetaResponse }> {
        const { take, skip } = query;
        const [data, count] = await this.mediaStreamService.find(query);
        return {
            data,
            meta: MetaResponse.generateMetaResponse(skip, take, count),
        };
    }
}
