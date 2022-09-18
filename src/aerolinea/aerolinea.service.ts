import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/business-errors';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>,
  ) {}

  async findAll(): Promise<AerolineaEntity[]> {
    return await this.aerolineaRepository.find({});
  }

  async findOne(id: string): Promise<AerolineaEntity> {
    try {
      const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne(
        { where: { id }, relations: ['aeropuertos'] },
      );
      if (!aerolinea)
        throw new BusinessLogicException(
          'The aerolinea with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      return aerolinea;
    } catch (error) {
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  }

  async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    return await this.aerolineaRepository.save(aerolinea);
  }

  async update(
    id: string,
    aerolinea: AerolineaEntity,
  ): Promise<AerolineaEntity> {
    try {
      const persistedAerolinea: AerolineaEntity =
        await this.aerolineaRepository.findOne({ where: { id } });
      if (!persistedAerolinea)
        throw new BusinessLogicException(
          'The aerolinea with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      return await this.aerolineaRepository.save({
        ...persistedAerolinea,
        ...aerolinea,
      });
    } catch (error) {
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  }

  async delete(id: string) {
    try {
      const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne(
        { where: { id } },
      );
      if (!aerolinea)
        throw new BusinessLogicException(
          'The aerolinea with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      await this.aerolineaRepository.remove(aerolinea);
    } catch (error) {
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  }
}
