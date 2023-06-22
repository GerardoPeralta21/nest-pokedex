import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value))
      throw new BadRequestException(`el id ${value} no es un ID valido}`, {
        cause: new Error(),
        description: 'Se espera un mongoId pero se recibio algo que no lo és',
      });
    return value.toUpperCase();
  }
}
