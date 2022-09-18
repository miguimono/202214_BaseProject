import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-config';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';

import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for (let i = 0; i < 5; i++) {
      const airline: AirlineEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.past(),
        paginaWeb: faker.internet.url(),
      });
      airlinesList.push(airline);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne should return an airline by id', async () => {
    const storedAirline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.nombre).toEqual(storedAirline.nombre);
    expect(airline.descripcion).toEqual(storedAirline.descripcion);
    expect(airline.fechaFundacion).toEqual(storedAirline.fechaFundacion);
    expect(airline.paginaWeb).toEqual(storedAirline.paginaWeb);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      airports: [],
    };
    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();

    const storedMuseum: AirlineEntity = await repository.findOne({
      where: { id: newAirline.id },
    });
    expect(storedMuseum).not.toBeNull();
    expect(storedMuseum.nombre).toEqual(newAirline.nombre);
    expect(storedMuseum.descripcion).toEqual(newAirline.descripcion);
    expect(storedMuseum.fechaFundacion).toEqual(newAirline.fechaFundacion);
    expect(storedMuseum.paginaWeb).toEqual(newAirline.paginaWeb);
  });

  it('update should modify a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.nombre = 'New name';

    const updatedAirline: AirlineEntity = await service.update(
      airline.id,
      airline,
    );
    expect(updatedAirline).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.nombre).toEqual(airline.nombre);
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline,
      nombre: 'New name',
    };
    await expect(() => service.update('0', airline)).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('delete should remove a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);

    const deletedAirline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });
    expect(deletedAirline).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
});
