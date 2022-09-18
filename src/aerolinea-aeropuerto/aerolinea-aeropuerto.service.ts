import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/business-errors';

@Injectable()
export class AerolineaAeropuertoService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>,

    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
  ) {}

  async addAirportToAirline(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<AerolineaEntity> {
    const aeropuerto: AeropuertoEntity =
      await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
    return await this.aerolineaRepository.save(aerolinea);
  }

  async findAirportFromAirline(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<AeropuertoEntity> {
    const aeropuerto: AeropuertoEntity =
      await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(
      (e) => e.id === aeropuerto.id,
    );

    if (!aerolineaAeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id is not associated to the aerolinea',
        BusinessError.PRECONDITION_FAILED,
      );

    return aerolineaAeropuerto;
  }

  async findAirportsFromAirline(
    aerolineaId: string,
  ): Promise<AeropuertoEntity[]> {
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return aerolinea.aeropuertos;
  }

  async deleteAirportsFromAirline(aerolineadId: string, aeropuertoId: string) {
    const aeropuerto: AeropuertoEntity =
      await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
      where: { id: aerolineadId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(
      (e) => e.id === aeropuerto.id,
    );

    if (!aerolineaAeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id is not associated to the aerolinea',
        BusinessError.PRECONDITION_FAILED,
      );

    aerolinea.aeropuertos = aerolinea.aeropuertos.filter(
      (e) => e.id !== aeropuertoId,
    );
    await this.aerolineaRepository.save(aerolinea);
  }
}
