import {
  Injectable,
} from '@nestjs/common';
import { ITokenPayload } from '../../common/models';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  generateJWTToken(payload: ITokenPayload): string {
    const secret: string = this.configService.get('JWT.SECRET');
    const expiresIn: string = this.configService.get('JWT.EXPIRES');
    return this.jwtService.sign(payload, { expiresIn, secret });
  }
}
