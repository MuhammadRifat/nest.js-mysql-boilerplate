import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { KnexModule } from 'nest-knexjs';
import knexConfig from 'config/knex-config';
import { EnumModule } from './modules/enum/enum.module';
import { FileLibraryModule } from './modules/file-library/file-library.module';
import { join } from 'path';
import { LogModule } from './modules/log/log.module';
import { TimeModule } from './modules/time/time.module';
import { CachingModule } from './modules/caching/caching.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
      serveRoot: '/static',
    }),
    KnexModule.forRoot(knexConfig),
    TimeModule,
    CachingModule,
    LogModule,
    UserModule,
    AuthModule,
    EnumModule,
    FileLibraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
