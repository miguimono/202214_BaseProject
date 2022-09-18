import { AirlineEntity } from '../airline/airline.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AirportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  codigoIATA: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @ManyToOne(() => AirlineEntity, (airline) => airline.airports)
  airline: AirlineEntity;
}
