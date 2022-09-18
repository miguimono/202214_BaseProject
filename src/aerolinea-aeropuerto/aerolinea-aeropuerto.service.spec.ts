import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-config';
import { Repository } from 'typeorm';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(
      AerolineaAeropuertoService,
    );
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aerolineaRepository.clear();
    aeropuertoRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.company.name(),
        codigoIATA: faker.word.preposition(),
        pais: faker.address.country(),
        ciudad: faker.address.city(),
      });
      aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      image: faker.image.imageUrl(),
      aeropuertos: aeropuertosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportAirline should add an airport to an airline', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigoIATA: faker.word.noun(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    });

    const result: AerolineaEntity = await service.addAirportToAirline(
      newAerolinea.id,
      newAeropuerto.id,
    );

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(result.aeropuertos[0].codigoIATA).toBe(newAeropuerto.codigoIATA);
    expect(result.aeropuertos[0].pais).toBe(newAeropuerto.pais);
    expect(result.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
  });

  it('addAirportToAirline should thrown exception for an invalid airport', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
    });

    await expect(() =>
      service.addAirportToAirline(newAerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id was not found',
    );
  });

  it('addAirportToAirline should throw an exception for an invalid airline', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigoIATA: faker.word.noun(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.addAirportToAirline('0', newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });

  it('findAirportFromAirline should return airport by airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity =
      await service.findAirportFromAirline(aerolinea.id, aeropuerto.id);
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(aeropuerto.nombre);
    expect(storedAeropuerto.codigoIATA).toBe(aeropuerto.codigoIATA);
    expect(storedAeropuerto.pais).toBe(aeropuerto.pais);
    expect(storedAeropuerto.ciudad).toBe(aeropuerto.ciudad);
  });

  it('findAirportFromAirline should throw an exception for an invalid airport', async () => {
    await expect(() =>
      service.findAirportFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id was not found',
    );
  });

  it('findAirportFromAirline should throw an exception for an invalid airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() =>
      service.findAirportFromAirline('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });

  it('findAirportFromAirline should throw an exception for an airline not associated to the airport', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigoIATA: faker.word.noun(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.findAirportFromAirline(aerolinea.id, newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id is not associated to the aerolinea',
    );
  });

  it('findAirportsFromAirline should return airports by airline', async () => {
    const aeropuertos: AeropuertoEntity[] =
      await service.findAirportsFromAirline(aerolinea.id);
    expect(aeropuertos.length).toBe(5);
  });

  it('findAirportsFromAirline should throw an exception for an invalid airline', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });

  it('deleteAirportsFromAirline should remove an airport from an airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];

    await service.deleteAirportsFromAirline(aerolinea.id, aeropuerto.id);

    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({
      where: { id: aerolinea.id },
      relations: ['aeropuertos'],
    });
    const deletedAeropuerto: AeropuertoEntity =
      storedAerolinea.aeropuertos.find((a) => a.id === aeropuerto.id);

    expect(deletedAeropuerto).toBeUndefined();
  });

  it('deleteAirportsFromAirline should thrown an exception for an invalid airport', async () => {
    await expect(() =>
      service.deleteAirportsFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id was not found',
    );
  });

  it('deleteAirportsFromAirline should thrown an exception for an invalid airport', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() =>
      service.deleteAirportsFromAirline('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });

  it('deleteAirportsFromAirline should thrown an exception for an non asocciated aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigoIATA: faker.word.noun(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
    });

    await expect(() =>
      service.deleteAirportsFromAirline(aerolinea.id, newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id is not associated to the aerolinea',
    );
  });
});
