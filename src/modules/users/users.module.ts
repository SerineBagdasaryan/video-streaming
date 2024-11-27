import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationModule } from '../organization';

@Module({
  imports: [
    OrganizationModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        signOptions: { expiresIn: configService.get('JWT_SECRET') },
        secret: configService.get('JWT_EXPIRES'),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
