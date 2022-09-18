import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';

describe('AeropuertoService', () => {
  let service: AeropuertoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
