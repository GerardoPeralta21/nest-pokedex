import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreatePokemonDto {
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(0)
  no: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
