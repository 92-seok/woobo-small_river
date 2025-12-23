import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Location, NetworkDevice } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3307),
        username: configService.get('DB_USERNAME', 'woobo_table'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'woobo_table'),
        entities: [Location, NetworkDevice],
        synchronize: false,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule { }