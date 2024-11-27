import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderBy } from 'src/common/enum';
import { MediaStream, Organization } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateMediaStreamDTO, PaginationQueryDTO } from '../../common/dto';
import _ from 'lodash';

@Injectable()
export class MediaStreamService {
  constructor(
    @InjectRepository(MediaStream)
    private readonly mediaRepository: Repository<MediaStream>,
  ) {}

  async create(params: CreateMediaStreamDTO): Promise<MediaStream> {
    console.log(222222222, params);
    const media = this.mediaRepository.create({
      ...params,
    });

    return await this.mediaRepository.save(media);
  }

  async find(
    query: PaginationQueryDTO,
    organization: Organization,
  ): Promise<[MediaStream[], number]> {
    const { take, skip } = query;

    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .leftJoinAndSelect('media.organization', 'organization')
      .take(Number(take || 10))
      .skip(Number(skip || 0))
      .orderBy('media.createdAt', OrderBy.DESC);
    if (organization?.id) {
      queryBuilder.andWhere('media.organizationId = :organizationId', {
        organizationId: organization.id,
      });
    }

    return await queryBuilder.getManyAndCount();
  }

  // async find(
  //   query: PaginationQueryDTO,
  //   organization: Organization,
  // ): Promise<[MediaStream[], number]> {
  //   const { take, skip } = query;
  //   console.log(55555, organization);
  //   const queryBuilder = this.mediaRepository
  //     .createQueryBuilder('media')
  //     .leftJoinAndSelect('media.organization', 'organization')
  //     .take(Number(take || 10))
  //     .skip(Number(skip || 0))
  //     .orderBy('media.createdAt', OrderBy.DESC);
  //   if (!organization?.id) {
  //     queryBuilder.andWhere(`"media"."organizationId" = '${organization?.id}'`);
  //   }
  //   return await queryBuilder.getManyAndCount();
  // }
}
