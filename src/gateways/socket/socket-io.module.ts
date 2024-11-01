import { Module } from '@nestjs/common';
import { SocketIoGateway } from './socket-io.gateway';
import { MediaStreamModule } from '../../modules'
@Module({
  imports: [MediaStreamModule],
  providers: [SocketIoGateway],
  exports: [SocketIoGateway],
})
export class SocketIoModule {}
