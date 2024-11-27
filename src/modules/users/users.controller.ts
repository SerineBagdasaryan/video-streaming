import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Body,
  Post,
  UseGuards,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUserDTO } from './dto/sign-user.dto';
import { APIKeyGuard } from '../../common/guards';
import { AuthApiKey } from '../../common/decorators/auth-api-key';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES } from '../../common/messages';
import { Organization } from '../../database/entities';
import { OrganizationService } from '../organization';

@ApiTags('Users')
@Controller('users')
@UseGuards(APIKeyGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => OrganizationService))
    private readonly orgService: OrganizationService,
  ) {}

  @Post('/sign')
  @ApiOkResponse({ description: 'User sign.' })
  @ApiOperation({ description: 'Sign a user.', summary: 'Sign user' })
  async sign(
    @Body() body: SignUserDTO,
    @AuthApiKey() apiKey: string,
  ): Promise<{ data: { accessToken: string; url: string } }> {
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
      const payload = {
        userId: body.userId,
        apiKey,
      };
      const accessToken: string = this.usersService.generateJWTToken(payload);
      const url = `http://${this.configService.get(
        'STREAM_HOST',
      )}:${this.configService.get('PORT')}`;

      return { data: { accessToken, url } };
    } catch (e) {
      throw e;
    }
  }
}
