import { BadRequestException, Injectable, Module } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class PokemonService {
  constructor(@InjectModel(Pokemon.name) private catModel: Model<Pokemon>) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const createdPokemon = new this.catModel(createPokemonDto);
      const pokemonSaved = await createdPokemon.save();
      return pokemonSaved;
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) pokemon = await this.catModel.findOne({ no: term });
    if (isValidObjectId(term))
      pokemon = await this.catModel.findOne({ _id: term });
    if (!pokemon) pokemon = await this.catModel.findOne({ name: term });
    if (!pokemon)
      throw new BadRequestException('Not found', {
        cause: new Error(),
        description: 'id, no or name doesnt exist',
      });

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon: Pokemon = await this.findOne(id);

    try {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      await pokemon.updateOne(updatePokemonDto).exec();

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  async remove(id: string) {
    // return this.catModel.findByIdAndRemove({ _id: id }).exec();
    // return { id };
    // return await this.catModel.deleteOne({ _id: id });
    const { deletedCount } = await this.catModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`No existe el registro`);
    return { msg: `Registro con id ${id} eliminado` };
  }

  private handlerErrors(error: any) {
    if (error.code === 11000) {
      console.log(error);
      throw new BadRequestException(
        'The record already exists in the database',
      );
    }

    throw new BadRequestException('Error, revisar la consola');
  }
}
