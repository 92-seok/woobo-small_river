import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../../database/entities';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) { }

  async findAllWithCoordinates() {
    return await this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.devices', 'devices')
      .where('location.latitude IS NOT NULL')
      .andWhere('location.longitude IS NOT NULL')
      .select([
        'location.locationId',
        'location.regionProvince',
        'location.regionCity',
        'location.streamName',
        'location.addressText',
        'location.latitude',
        'location.longitude',
        'location.statusCode',
        'location.monitoringStatus',
        'devices.deviceId',
        'devices.deviceType',
        'devices.vendor',
        'devices.statusPing',
      ])
      .getMany();
  }

  async findOne(id: number) {
    return await this.locationRepository.findOne({
      where: { locationId: id },
      relations: ['devices'],
    });
  }
}