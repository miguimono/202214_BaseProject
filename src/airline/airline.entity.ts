import { AirportEntity } from '../airport/airport.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AirlineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  fechaFundacion: Date;

  @Column()
  paginaWeb: string;

  @OneToMany(() => AirportEntity, (airport) => airport.airline)
  airports: AirportEntity[];
}
