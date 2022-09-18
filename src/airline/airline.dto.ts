import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class AirlineDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  readonly fechaFundacion: Date;

  @IsUrl()
  @IsNotEmpty()
  readonly paginaWeb: string;
}
