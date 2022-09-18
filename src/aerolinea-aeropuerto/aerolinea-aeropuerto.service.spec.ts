import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(
      AerolineaAeropuertoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
