import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location, NetworkDevice } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Location, NetworkDevice])],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule { }
