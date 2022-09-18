import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
  ) {}

  async findAll(): Promise<AeropuertoEntity[]> {
    return await this.aeropuertoRepository.find({});
  }

  async findOne(id: string): Promise<AeropuertoEntity> {
    try {
      const aeropuerto: AeropuertoEntity =
        await this.aeropuertoRepository.findOne({
          where: { id },
          relations: ['aerolinea'],
        });
      if (!aeropuerto)
        throw new BusinessLogicException(
          'The aeropuerto with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      return aeropuerto;
    } catch (error) {
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  }

  async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    return await this.aeropuertoRepository.save(aeropuerto);
  }

  async update(
    id: string,
    aeropuerto: AeropuertoEntity,
  ): Promise<AeropuertoEntity> {
    try {
      const persistedAeropuerto: AeropuertoEntity =
        await this.aeropuertoRepository.findOne({ where: { id } });
      if (!persistedAeropuerto)
        throw new BusinessLogicException(
          'The aeropuerto with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      return await this.aeropuertoRepository.save({
        ...persistedAeropuerto,
        ...aeropuerto,
      });
    } catch (error) {
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  }

  async delete(id: string) {
    try {
      const aeropuerto: AeropuertoEntity =
        await this.aeropuertoRepository.findOne({ where: { id } });
      if (!aeropuerto)
        throw new BusinessLogicException(
          'The aeropuerto with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      await this.aeropuertoRepository.remove(aeropuerto);
    } catch (error) {
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  }
}
