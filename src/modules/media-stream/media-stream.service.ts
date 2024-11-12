import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaTypes, OrderBy } from 'src/common/enum';
import { MediaStream } from 'src/database/entities';
import { Repository } from 'typeorm';
import { MediaRecordingDTO } from './dto';

@Injectable()
export class MediaStreamService {
    constructor(
        @InjectRepository(MediaStream)
        private readonly mediaRepository: Repository<MediaStream>,
    ) {}

    async create(userId: number, type: MediaTypes, filePath: string): Promise<MediaStream> {
        const media = this.mediaRepository.create({
            userId,
            type,
            filePath,
        });

        return await this.mediaRepository.save(media);
    }
    async find(query: MediaRecordingDTO): Promise<[MediaStream[], number]> {
        const { take, skip, userId } = query;
        const result = this.mediaRepository
            .createQueryBuilder('media')
            .take(Number(take || 10))
            .skip(Number(skip || 0))
            .orderBy('media.createdAt', OrderBy.DESC);
        if (userId) {
        result.andWhere('media."userId" = :userId', { userId })
        }
        return await result.getManyAndCount();
    }
}
