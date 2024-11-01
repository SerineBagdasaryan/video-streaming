import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync, WriteStream } from 'fs';
import { Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { MediaTypes } from 'src/common/enum';
import { generateUniqueFileName } from 'src/common/helpers';
import { ConfigService } from '@nestjs/config';
import { MediaStreamService } from 'src/modules';

@WebSocketGateway({
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
  },
})
export class SocketIoGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private uploadsDir = join(process.cwd(), 'uploads');
  private activeStreams: Record<string, WriteStream> = {};

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
              private readonly configService: ConfigService,
              private readonly mediaStreamService: MediaStreamService) {}

  afterInit() {
    console.log('WebSocket initialized');
  }

  async handleConnection(socket: Socket): Promise<void> {
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
    const userId: number = socket['userId'];
    await this.cacheManager.set(`clientStreamPaths:${userId}`, {
      camera: null,
      screen: null,
    });
  }

  async handleDisconnect(client: Socket) {
    const userId: number = client['userId'];
    await this.closeStream(userId, MediaTypes.camera);
    await this.closeStream(userId, MediaTypes.screen);
    await this.cacheManager.del(`clientStreamPaths:${userId}`);
  }
  private async getOrCreateStream(userId: number, type: MediaTypes): Promise<WriteStream | null> {
    const streamKey = `${userId}-${type}`;
    if (!this.activeStreams[streamKey]) {
      const fileName = generateUniqueFileName(userId, type);
      const filePath = join(this.uploadsDir, fileName);
      const stream = createWriteStream(filePath, { flags: 'a' });
      stream.on('error', async () => {
        await this.closeStream(userId, type);
      });

      stream.on('close', async () => {
        delete this.activeStreams[streamKey];
      });

      this.activeStreams[streamKey] = stream;
      const streamPaths = await this.cacheManager.get<Record<string, string>>(`clientStreamPaths:${userId}`) || {};
      streamPaths[type] = filePath;
      await this.cacheManager.set(`clientStreamPaths:${userId}`, streamPaths);
      const host = this.configService.get<string>('HOST') || 'localhost';
      const port = this.configService.get<number>('PORT') || 3000;
      const videoUrl = `http://${host}:${port}/uploads/${fileName}`;
      await this.mediaStreamService.saveMedia(userId, type, videoUrl);
      return stream;
    } else {
      const existingStream = this.activeStreams[streamKey];
      if (existingStream && existingStream.writable) {
        return existingStream;
      } else {
        console.error(`Existing stream for type ${type} is not writable.`);
        return null; 
      }
    }
  }

  @SubscribeMessage('video-stream')
  async handleVideoStream(
      client: Socket,
      data: { videoData: Buffer; type: MediaTypes },
  ) {
    const { videoData, type } = data;
    const userId: number = client['userId'];
    const stream = await this.getOrCreateStream(userId, type);

    if (stream && stream?.writable) {
      try {
        stream.write(videoData, (err) => {
          if (err) {
            console.error(`Error writing to ${type} stream: ${err.message}`);
          } else {
            console.log(`Successfully wrote video data to ${type} stream.`);
          }
        });
      } catch (error) {
        console.error(`Failed to write video data to ${type} stream: ${error.message}`);
      }
    } else {
      console.error(`Stream for type ${type} is not writable or couldn't be created.`);
    }
  }

  private async closeStream(userId: number, type: MediaTypes) {
    const streamKey = `${userId}-${type}`;
    const stream = this.activeStreams[streamKey];

    if (stream && typeof stream.end === 'function') {
      stream.end();
      delete this.activeStreams[streamKey];
    } else {
      console.error(`No active stream to close for userId: ${userId} and type: ${type}`);
    }
  }
}