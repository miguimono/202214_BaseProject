import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/business-errors.interceptor';
import { AirlineAirportService } from './airline-airport.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(':airlineId/artworks/:airportId')
  async addAirportToAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.addAirportToAirline(
      airlineId,
      airportId,
    );
  }

  @Get(':airlineId/artworks/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Get(':airlineId/artworks')
  async findAirportsFromAirline(@Param('airlineId') airlineId: string) {
    return await this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Delete(':airlineId/artworks/:airportId')
  @HttpCode(204)
  async deleteAirportsFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.deleteAirportsFromAirline(
      airlineId,
      airportId,
    );
  }
}
