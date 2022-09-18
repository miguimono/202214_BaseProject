import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';

describe('AerolineaService', () => {
  let service: AerolineaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
