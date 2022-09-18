import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineEntity } from '../airline/airline.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/business-errors';

@Injectable()
export class AirlineAirportService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,

    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async addAirportToAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirlineEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    airline.airports = [...airline.airports, airport];
    return await this.airlineRepository.save(airline);
  }

  async findAirportFromAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirportEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airlineAirport: AirportEntity = airline.airports.find(
      (e) => e.id === airport.id,
    );

    if (!airlineAirport)
      throw new BusinessLogicException(
        'The airport with the given id is not associated to the airline',
        BusinessError.PRECONDITION_FAILED,
      );

    return airlineAirport;
  }

  async updateAirportFromAirline(
    airlineId: string,
    airportId: string,
    airport: AirportEntity,
  ): Promise<AirportEntity> {
    const airport2: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport2)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airline2: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline2)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airlineAirport: AirportEntity = airline2.airports.find(
      (e) => e.id === airport2.id,
    );

    if (!airlineAirport)
      throw new BusinessLogicException(
        'The airport with the given id is not associated to the airline',
        BusinessError.PRECONDITION_FAILED,
      );

    return await this.airportRepository.save({
      ...airlineAirport,
      ...airport,
    });
  }

  async findAirportsFromAirline(airlineId: string): Promise<AirportEntity[]> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return airline.airports;
  }

  async deleteAirportsFromAirline(airlinedId: string, airportId: string) {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlinedId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airlineAirport: AirportEntity = airline.airports.find(
      (e) => e.id === airport.id,
    );

    if (!airlineAirport)
      throw new BusinessLogicException(
        'The airport with the given id is not associated to the airline',
        BusinessError.PRECONDITION_FAILED,
      );

    airline.airports = airline.airports.filter((e) => e.id !== airportId);
    await this.airlineRepository.save(airline);
  }
}
