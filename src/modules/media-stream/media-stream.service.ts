import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaTypes } from 'src/common/enum';
import { MediaStream } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MediaStreamService {
    constructor(
        @InjectRepository(MediaStream)
        private readonly mediaRepository: Repository<MediaStream>,
    ) {}

    async saveMedia(userId: number, type: MediaTypes, filePath: string): Promise<MediaStream> {
        const media = this.mediaRepository.create({
            userId,
            type,
            filePath,
        });

        return await this.mediaRepository.save(media);
    }
}
