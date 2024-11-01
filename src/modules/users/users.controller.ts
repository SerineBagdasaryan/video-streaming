import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IResponseItem } from '../../common/interfaces';
import { TokenResponseDTO } from './dto';
import { SignUserDTO } from './dto/sign-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign')
  @ApiOkResponse({ description: 'User sign.' })
  @ApiOperation({ description: 'Sign a user.', summary: 'Sign user' })
  async sign(
    @Body() body: SignUserDTO,
  ): Promise<IResponseItem<TokenResponseDTO>> {
    const payload = {
      userId: body.userId,
    };
    const accessToken: string = this.usersService.generateJWTToken(payload);
    return { data: { accessToken } };
  }
}
