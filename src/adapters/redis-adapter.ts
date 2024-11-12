import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { verify } from 'jsonwebtoken';
import { ERROR_MESSAGES } from 'src/common/messages';

export class RedisAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    server.adapter(this.adapterConstructor);

    server.use((socket, next) => {
        const token = socket.handshake.query.token;
      if (!token) {
        return next(new Error(ERROR_MESSAGES.UNAUTHORIZED));
      }

      verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return next(new Error(ERROR_MESSAGES.UNAUTHORIZED));
        }
        socket.userId = decoded?.userId;
        next();
      });
    });

    return server;
  }
}
