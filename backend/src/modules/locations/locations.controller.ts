import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) { }

  @Get()
  async getAllLoations() {
    return await this.locationsService.findAllWithCoordinates();
  }

  @Get(':id')
  async getLocation(@Param('id') id: string) {
    return await this.locationsService.findOne(+id);
  }
}