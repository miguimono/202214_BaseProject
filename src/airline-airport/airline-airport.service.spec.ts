import { Test, TestingModule } from '@nestjs/testing';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { TypeOrmTestingConfig } from '../shared/testing-config';
import { Repository } from 'typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airline: AirlineEntity;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    airportRepository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    airlineRepository.clear();
    airportRepository.clear();

    airportsList = [];
    for (let i = 0; i < 5; i++) {
      const airport: AirportEntity = await airportRepository.save({
        nombre: faker.company.name(),
        codigoIATA: faker.word.preposition(),
        pais: faker.address.country(),
        ciudad: faker.address.city(),
      });
      airportsList.push(airport);
    }

    airline = await airlineRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      image: faker.image.imageUrl(),
      airports: airportsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportAirline should add an airport to an airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      nombre: faker.company.name(),
      codigoIATA: faker.word.noun(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
    });

    const newAirline: AirlineEntity = await airlineRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      airports: [],
    });

    const result: AirlineEntity = await service.addAirportToAirline(
      newAirline.id,
      newAirport.id,
    );

    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].nombre).toBe(newAirport.nombre);
    expect(result.airports[0].codigoIATA).toBe(newAirport.codigoIATA);
    expect(result.airports[0].pais).toBe(newAirport.pais);
    expect(result.airports[0].ciudad).toBe(newAirport.ciudad);
  });

  it('addAirportToAirline should thrown exception for an invalid airport', async () => {
    const newAirline: AirlineEntity = await airlineRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
    });

    await expect(() =>
      service.addAirportToAirline(newAirline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('addAirportToAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      nombre: faker.company.name(),
      codigoIATA: faker.word.noun(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.addAirportToAirline('0', newAirport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('findAirportFromAirline should return airport by airline', async () => {
    const airport: AirportEntity = airportsList[0];
    const storedAirport: AirportEntity = await service.findAirportFromAirline(
      airline.id,
      airport.id,
    );
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.nombre).toBe(airport.nombre);
    expect(storedAirport.codigoIATA).toBe(airport.codigoIATA);
    expect(storedAirport.pais).toBe(airport.pais);
    expect(storedAirport.ciudad).toBe(airport.ciudad);
  });

  it('findAirportFromAirline should throw an exception for an invalid airport', async () => {
    await expect(() =>
      service.findAirportFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('findAirportFromAirline should throw an exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(() =>
      service.findAirportFromAirline('0', airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('findAirportFromAirline should throw an exception for an airline not associated to the airport', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      nombre: faker.company.name(),
      codigoIATA: faker.word.noun(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.findAirportFromAirline(airline.id, newAirport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id is not associated to the airline',
    );
  });

  it('findAirportsFromAirline should return airports by airline', async () => {
    const airports: AirportEntity[] = await service.findAirportsFromAirline(
      airline.id,
    );
    expect(airports.length).toBe(5);
  });

  it('findAirportsFromAirline should throw an exception for an invalid airline', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('deleteAirportsFromAirline should remove an airport from an airline', async () => {
    const airport: AirportEntity = airportsList[0];

    await service.deleteAirportsFromAirline(airline.id, airport.id);

    const storedAirline: AirlineEntity = await airlineRepository.findOne({
      where: { id: airline.id },
      relations: ['airports'],
    });
    const deletedAirport: AirportEntity = storedAirline.airports.find(
      (a) => a.id === airport.id,
    );

    expect(deletedAirport).toBeUndefined();
  });

  it('deleteAirportsFromAirline should thrown an exception for an invalid airport', async () => {
    await expect(() =>
      service.deleteAirportsFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('deleteAirportsFromAirline should thrown an exception for an invalid airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(() =>
      service.deleteAirportsFromAirline('0', airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('deleteAirportsFromAirline should thrown an exception for an non asocciated airport', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      nombre: faker.company.name(),
      codigoIATA: faker.word.noun(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.deleteAirportsFromAirline(airline.id, newAirport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id is not associated to the airline',
    );
  });
});
