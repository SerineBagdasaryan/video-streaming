import { Module } from '@nestjs/common';
import { MediaStreamService } from './media-stream.service';
import { MediaStreamController } from './media-stream.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaStream} from '../../database/entities'
@Module({
  imports: [
    TypeOrmModule.forFeature([MediaStream]),
  ],
  controllers: [MediaStreamController],
  providers: [MediaStreamService],
  exports: [MediaStreamService]
})
export class MediaStreamModule {}
