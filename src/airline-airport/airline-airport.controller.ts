import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AirportDto } from 'src/airport/airport.dto';
import { AirportEntity } from 'src/airport/airport.entity';
import { AirlineDto } from '../airline/airline.dto';
import { AirlineEntity } from '../airline/airline.entity';
import { BusinessErrorsInterceptor } from '../shared/business-errors.interceptor';
import { AirlineAirportService } from './airline-airport.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(':airlineId/airports/:airportId')
  async addAirportToAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.addAirportToAirline(
      airlineId,
      airportId,
    );
  }

  @Get(':airlineId/airports/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Get(':airlineId/airports')
  async findAirportsFromAirline(@Param('airlineId') airlineId: string) {
    return await this.airlineAirportService.findAirportsFromAirline(airlineId);
  }
  @Put(':airlineId/airports/:airportId')
  async updateAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
    @Body() airportDto: AirportDto,
  ) {
    const airport: AirportEntity = plainToInstance(AirportEntity, airportDto);
    return await this.airlineAirportService.updateAirportFromAirline(
      airlineId,
      airportId,
      airport,
    );
  }

  @Delete(':airlineId/airports/:airportId')
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
