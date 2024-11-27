import { Module } from '@nestjs/common';
import { SocketIoGateway } from './socket-io.gateway';
import { MediaStreamModule, OrganizationModule } from '../../modules';
@Module({
  imports: [MediaStreamModule, OrganizationModule],
  providers: [SocketIoGateway],
  exports: [SocketIoGateway],
})
export class SocketIoModule {}
