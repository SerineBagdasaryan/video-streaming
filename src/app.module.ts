// // import { CacheModule, Module } from '@nestjs/common';
// // import { AppController } from './app.controller';
// // import { AppService } from './app.service';
// // import { UsersModule } from './modules/users/users.module';
// // import { ConfigModule, ConfigService } from '@nestjs/config';
// // import { redisStore } from 'cache-manager-redis-yet';
// // import { getEnvValidation } from './config/env.validation';
// // import { mainConfig } from './config/main.config';
// // import { SocketIoModule } from './gateways';
// // import { ServeStaticModule } from '@nestjs/serve-static';
// //
// // @Module({
// //   imports: [
// //     ServeStaticModule.forRoot({
// //       serveRoot: '/uploads',
// //       rootPath: 'uploads',
// //     }),
// //     UsersModule,
// //     SocketIoModule,
// //     ConfigModule.forRoot({
// //       validationSchema: getEnvValidation(),
// //       load: [mainConfig],
// //       isGlobal: true,
// //     }),
// //     ConfigModule.forRoot(),
// //     CacheModule.registerAsync({
// //       imports: [ConfigModule],
// //       isGlobal: true,
// //       useFactory: async (configService: ConfigService) => ({
// //         store: await redisStore({
// //           socket: {
// //             host: configService.get<string>('REDIS_HOST'),
// //             port: configService.get<number>('REDIS_PORT'),
// //           },
// //         }),
// //       }),
// //       inject: [ConfigService],
// //     }),
// //     // TypeOrmModule.forRootAsync({
// //     //   useFactory: getDatabaseConfig,
// //     //   imports: [ConfigModule],
// //     //   inject: [ConfigService],
// //     // }),
// //   ],
// //   controllers: [AppController],
// //   providers: [AppService],
// // })
// // export class AppModule {}
//
// import { CacheModule, Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UsersModule } from './modules/users/users.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { getEnvValidation } from './config/env.validation';
// import { mainConfig } from './config/main.config';
// import { SocketIoModule } from './gateways';
// import { ServeStaticModule } from '@nestjs/serve-static';
// // import { redisStore } from 'cache-manager-redis-yet';
// // import { redisStore } from 'cache-manager-redis-store';
// import * as redisStore from 'cache-manager-redis-store';
// import { CacheStore } from 'cache-manager';
// @Module({
//   imports: [
//     ServeStaticModule.forRoot({
//       serveRoot: '/uploads',
//       rootPath: 'uploads',
//     }),
//     UsersModule,
//     SocketIoModule,
//     ConfigModule.forRoot({
//       validationSchema: getEnvValidation(),
//       load: [mainConfig],
//       isGlobal: true,
//     }),
//     CacheModule.registerAsync({
//       imports: [ConfigModule],
//       isGlobal: true,
//       useFactory: async (configService: ConfigService) => ({
//         store: await redisStore({
//           socket: {
//             host: configService.get<string>('REDIS_HOST'),
//             port: configService.get<number>('REDIS_PORT'),
//           },
//         }),
//         // ttl: 300,
//       }),
//       inject: [ConfigService],
//     }),
//
//     // CacheModule.registerAsync({
//     //   imports: [ConfigModule],
//     //   isGlobal: true,
//     //   useFactory: async (configService: ConfigService) => ({
//     //     store: await redisStore({
//     //       socket: {
//     //         host: process.env.REDIS_HOST,
//     //         port: +process.env.REDIS_PORT,
//     //       },
//     //     }),
//     //     inject: [ConfigService],
//     //   }),
//     // }),
//     // TypeOrmModule.forRootAsync({
//     //   useFactory: getDatabaseConfig,
//     //   imports: [ConfigModule],
//     //   inject: [ConfigService],
//     // }),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvValidation } from './config/env.validation';
import { mainConfig } from './config/main.config';
import { SocketIoModule } from './gateways';
import { ServeStaticModule } from '@nestjs/serve-static';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from "./config/database.config";
import { MediaStreamModule, UsersModule } from './modules';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: 'uploads',
    }),
    UsersModule,
    SocketIoModule,
    MediaStreamModule,
    ConfigModule.forRoot({
      validationSchema: getEnvValidation(),
      load: [mainConfig],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
        }),
        ttl: configService.get<number>('CACHE_TTL') || 3600,
      }),
      inject: [ConfigService],
    }),
    MediaStreamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
