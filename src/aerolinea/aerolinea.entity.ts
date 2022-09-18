import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AerolineaEntity {
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

  @OneToMany(() => AeropuertoEntity, (aeropuerto) => aeropuerto.aerolinea)
  aeropuertos: AeropuertoEntity[];
}
