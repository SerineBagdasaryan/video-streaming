import {
  Controller,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MediaStreamService } from './media-stream.service';
import { IMetaResponse } from 'src/common/interfaces';
import { MediaStream, Organization } from '../../database/entities';
import { MetaResponse } from 'src/common/helpers';
import { APIKeyGuard } from '../../common/guards';
import { AuthApiKey } from '../../common/decorators/auth-api-key';
import { OrganizationService } from '../organization';
import _ from 'lodash';
import { ERROR_MESSAGES } from '../../common/messages';
import { PaginationQueryDTO } from '../../common/dto';

@Controller('media-stream')
@UseGuards(APIKeyGuard)
export class MediaStreamController {
  constructor(
    private readonly mediaStreamService: MediaStreamService,
    @Inject(forwardRef(() => OrganizationService))
    private readonly orgService: OrganizationService,
  ) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDTO,
    @AuthApiKey() apiKey: string,
  ): Promise<{ data: MediaStream[]; meta: IMetaResponse }> {
    try {
      if (!apiKey) {
        throw new NotFoundException(ERROR_MESSAGES.USER_API_KEY_NOT_EXISTS);
      }
      const organization: Organization = await this.orgService.findOne({
        apiKey,
      });
      if (!organization) {
        throw new NotFoundException(ERROR_MESSAGES.USER_API_KEY_NOT_EXISTS);
      }
      const { take, skip } = query;
      const [data, count] = await this.mediaStreamService.find(
        query,
        organization,
      );
      return {
        data,
        meta: MetaResponse.generateMetaResponse(skip, take, count),
      };
    } catch (e) {
      throw e;
    }
  }
}
